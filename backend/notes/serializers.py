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


class NoteSerializer(serializers.ModelSerializer):
    subject_id = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all(),
        source="subject",
        write_only=True
    )

    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "subject_id",
            "pdf_url",
            "created_at",
            "download_count",
        ]
