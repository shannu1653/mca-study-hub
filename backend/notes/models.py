from django.db import models


class Year(models.Model):
    name = models.CharField(max_length=100)  
    # Example: MCA 1st Year, MCA 2nd Year

    def __str__(self):
        return self.name


class Semester(models.Model):
    year = models.ForeignKey(Year, on_delete=models.CASCADE, related_name="semesters")
    name = models.CharField(max_length=100)
    # Example: Semester 1, Semester 2

    def __str__(self):
        return f"{self.year.name} - {self.name}"


class Subject(models.Model):
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name="subjects")
    name = models.CharField(max_length=200)
    # Example: Data Structures, DBMS

    def __str__(self):
        return f"{self.semester.name} - {self.name}"


class Note(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="notes")
    title = models.CharField(max_length=255)
    pdf_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
