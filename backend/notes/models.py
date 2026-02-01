from django.db import models


class Year(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Semester(models.Model):
    year = models.ForeignKey(
        Year,
        on_delete=models.CASCADE,
        related_name="semesters"
    )
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.year.name} - {self.name}"


class Subject(models.Model):
    semester = models.ForeignKey(
        Semester,
        on_delete=models.CASCADE,
        related_name="subjects"
    )
    name = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.semester.name} - {self.name}"


class Note(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="notes")
    title = models.CharField(max_length=255)
    pdf_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

    download_count = models.PositiveIntegerField(default=0)  # ✅ REQUIRED

