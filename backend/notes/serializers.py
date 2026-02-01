from rest_framework import serializers
from .models import Year, Semester, Subject, Note

# ==================================================
# YEAR
# ==================================================

class YearSerializer(serializers.ModelSerializer):
    class Meta:
        model = Year
        fields = ["id", "name"]


# ==================================================
# SEMESTER
# ==================================================

class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = ["id", "name", "year"]

    def validate_year(self, value):
        if not value:
            raise serializers.ValidationError("Year is required")
        return value


# ==================================================
# SUBJECT
# ==================================================

class SubjectSerializer(serializers.ModelSerializer):
    semester = serializers.PrimaryKeyRelatedField(
        queryset=Semester.objects.all()
    )

    class Meta:
        model = Subject
        fields = ["id", "name", "semester"]


# ==================================================
# NESTED DISPLAY SERIALIZERS (FOR NOTES PAGE)
# ==================================================

class SemesterDetailSerializer(serializers.ModelSerializer):
    year = YearSerializer(read_only=True)

    class Meta:
        model = Semester
        fields = ["id", "name", "year"]


class SubjectDetailSerializer(serializers.ModelSerializer):
    semester = SemesterDetailSerializer(read_only=True)

    class Meta:
        model = Subject
        fields = ["id", "name", "semester"]


# ==================================================
# NOTE (READ – FRONTEND)
# ==================================================

class NoteSerializer(serializers.ModelSerializer):
    subject = SubjectDetailSerializer(read_only=True)

    # 🔥 THIS IS WHAT FRONTEND USES
    file = serializers.CharField(source="pdf_url", read_only=True)

    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "file",          # frontend opens this
            "pdf_url",       # optional (admin/debug)
            "created_at",
            "subject",
            "download_count",
        ]


# ==================================================
# NOTE CREATE / UPDATE (ADMIN)
# ==================================================

class NoteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "pdf_url",
            "subject",
        ]
