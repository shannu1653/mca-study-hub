from rest_framework import serializers
from .models import Year, Semester, Subject, Note


# =====================
# BASIC SERIALIZERS (Admin / Dropdowns)
# =====================

class YearSerializer(serializers.ModelSerializer):
    class Meta:
        model = Year
        fields = ["id", "name"]


class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = ["id", "name", "year"]

    def validate_year(self, value):
        if not value:
            raise serializers.ValidationError("Year is required")
        return value


from rest_framework import serializers
from .models import Subject


class SubjectSerializer(serializers.ModelSerializer):
    semester = serializers.PrimaryKeyRelatedField(
        queryset=Subject._meta.get_field('semester').remote_field.model.objects.all()
    )

    class Meta:
        model = Subject
        fields = ["id", "semester", "name"]


# =====================
# NESTED SERIALIZERS (Notes Page)
# =====================

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


class NoteSerializer(serializers.ModelSerializer):
    subject = SubjectDetailSerializer(read_only=True)

    class Meta:
        model = Note
        fields = ["id", "title", "pdf_url", "created_at", "subject"]


# =====================
# NOTE CREATE (UPLOAD)
# =====================

class NoteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["subject", "title", "pdf_url"]
