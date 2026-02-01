from rest_framework.views import APIView
from rest_framework.generics import (
    ListCreateAPIView,
    DestroyAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Note, Year, Semester, Subject
from .serializers import (
    NoteSerializer,
    YearSerializer,
    SemesterSerializer,
    SubjectSerializer,
)

# =====================================================
# NOTES (LIST + CREATE)
# =====================================================

class NotesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notes = (
            Note.objects
            .select_related(
                "subject",
                "subject__semester",
                "subject__semester__year"
            )
            .order_by("-created_at")
        )
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        if not request.user.is_staff:
            return Response(
                {"detail": "Admin only"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = NoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Note uploaded successfully"},
            status=status.HTTP_201_CREATED
        )


# =====================================================
# NOTE DETAIL (VIEW / UPDATE / DELETE)
# =====================================================

class NoteDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(
                {"detail": "Admin only"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().delete(request, *args, **kwargs)


# =====================================================
# YEARS
# =====================================================

class YearListCreateView(ListCreateAPIView):
    queryset = Year.objects.all()
    serializer_class = YearSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({"detail": "Admin only"}, status=403)
        return super().post(request, *args, **kwargs)


class YearDeleteView(DestroyAPIView):
    queryset = Year.objects.all()
    serializer_class = YearSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({"detail": "Admin only"}, status=403)
        return super().delete(request, *args, **kwargs)


# =====================================================
# SEMESTERS
# =====================================================

class SemesterListCreateView(ListCreateAPIView):
    serializer_class = SemesterSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        year_id = self.request.query_params.get("year")
        qs = Semester.objects.all()
        if year_id:
            qs = qs.filter(year_id=year_id)
        return qs

    def post(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({"detail": "Admin only"}, status=403)
        return super().post(request, *args, **kwargs)


class SemesterDeleteView(DestroyAPIView):
    queryset = Semester.objects.all()
    serializer_class = SemesterSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({"detail": "Admin only"}, status=403)
        return super().delete(request, *args, **kwargs)


# =====================================================
# SUBJECTS
# =====================================================

class SubjectListCreateView(ListCreateAPIView):
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        semester_id = self.request.query_params.get("semester")
        qs = Subject.objects.all()
        if semester_id:
            qs = qs.filter(semester_id=semester_id)
        return qs

    def post(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({"detail": "Admin only"}, status=403)
        return super().post(request, *args, **kwargs)


class SubjectDeleteView(DestroyAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({"detail": "Admin only"}, status=403)
        return super().delete(request, *args, **kwargs)
