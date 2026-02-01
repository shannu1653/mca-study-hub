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


# ================= NOTE (MAIN – FRONTEND USES THIS) =================
class NoteSerializer(serializers.ModelSerializer):
    subject = SubjectDetailSerializer(read_only=True)

    # 🔥 VERY IMPORTANT
    file = serializers.URLField(source="pdf_url", read_only=True)

    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "file",          # frontend uses this
            "pdf_url",       # optional
            "created_at",
            "download_count",
            "subject",
        ]


# ================= NOTE CREATE (ADMIN) =================
class NoteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "pdf_url", "subject"]
