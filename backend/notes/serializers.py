from rest_framework import serializers
from .models import Year, Semester, Subject, Note

# ================= YEAR =================
class YearSerializer(serializers.ModelSerializer):
    class Meta:
        model = Year
        fields = ["id", "name"]


# ================= SEMESTER =================
class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = ["id", "name", "year"]


class SemesterDetailSerializer(serializers.ModelSerializer):
    year = YearSerializer(read_only=True)

    class Meta:
        model = Semester
        fields = ["id", "name", "year"]


# ================= SUBJECT =================
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ["id", "name", "semester"]


class SubjectDetailSerializer(serializers.ModelSerializer):
    semester = SemesterDetailSerializer(read_only=True)

    class Meta:
        model = Subject
        fields = ["id", "name", "semester"]


# ================= NOTE =================
class NoteSerializer(serializers.ModelSerializer):
    # READ: nested subject
    subject = SubjectDetailSerializer(read_only=True)

    # WRITE: subject id only
    subject_id = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all(),
        source="subject",
        write_only=True
    )

    # READ: full pdf url
    pdf_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "subject",
            "subject_id",
            "pdf_url",
            "created_at",
            "download_count",
        ]

    def get_pdf_url(self, obj):
        """
        Safe for:
        - local development
        - Render
        - Supabase / cloud URLs
        """
        if not obj.pdf:
            return None

        pdf_url = obj.pdf.url

        request = self.context.get("request")

        # If already absolute URL (Supabase, S3, etc.)
        if pdf_url.startswith("http"):
            return pdf_url

        # Build absolute URL only if request exists
        if request:
            return request.build_absolute_uri(pdf_url)

        # Fallback (prevents 500 error)
        return pdf_url
