from rest_framework.views import APIView
from rest_framework.generics import (
    ListCreateAPIView,
    DestroyAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404

from .models import Note, Year, Semester, Subject
from .serializers import (
    NoteSerializer,
    NoteCreateSerializer,
    YearSerializer,
    SemesterSerializer,
    SubjectSerializer,
)

# =====================================================
# NOTES
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

        serializer = NoteCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Note uploaded successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =====================================================
# YEARS
# =====================================================

class YearListCreateView(ListCreateAPIView):
    queryset = Year.objects.all()
    serializer_class = YearSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(
                {"detail": "Admin only"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().post(request, *args, **kwargs)


class YearDeleteView(DestroyAPIView):
    queryset = Year.objects.all()
    serializer_class = YearSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(
                {"detail": "Admin only"},
                status=status.HTTP_403_FORBIDDEN
            )
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
            return Response(
                {"detail": "Admin only"},
                status=status.HTTP_403_FORBIDDEN
            )

        if not request.data.get("year"):
            return Response(
                {"error": "year is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not request.data.get("name"):
            return Response(
                {"error": "semester name is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().post(request, *args, **kwargs)


class SemesterDeleteView(DestroyAPIView):
    queryset = Semester.objects.all()
    serializer_class = SemesterSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(
                {"detail": "Admin only"},
                status=status.HTTP_403_FORBIDDEN
            )
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
            return Response(
                {"detail": "Only admin can add subject"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().post(request, *args, **kwargs)


class SubjectDeleteView(DestroyAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(
                {"detail": "Admin only"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().delete(request, *args, **kwargs)


# =====================================================
# NOTE DETAIL (VIEW / UPDATE / DELETE)
# =====================================================

class NoteDetailView(RetrieveUpdateDestroyAPIView):
    queryset = (
        Note.objects
        .select_related("subject__semester__year")
    )
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
# DOWNLOAD COUNT (NO FILE SERVING)
# =====================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def increase_download(request, pk):
    note = get_object_or_404(Note, pk=pk)

    # Safe increment
    if hasattr(note, "download_count"):
        note.download_count = (note.download_count or 0) + 1
        note.save(update_fields=["download_count"])

    return Response({"success": True}, status=status.HTTP_200_OK)
