from django.urls import path
from .views import (
    NotesView,
    YearListCreateView,
    YearDeleteView,
    SemesterListCreateView,
    SemesterDeleteView,
    SubjectListCreateView,
    SubjectDeleteView,
    NoteDetailView,
    increase_download,
)

urlpatterns = [
    # ================= NOTES =================
    path("", NotesView.as_view()),                 # GET, POST
    path("<int:pk>/", NoteDetailView.as_view()),   # GET, PUT, DELETE
    path("<int:pk>/download/", increase_download),# POST

    # ================= YEARS =================
    path("years/", YearListCreateView.as_view()),
    path("years/<int:pk>/", YearDeleteView.as_view()),

    # ================= SEMESTERS =================
    path("semesters/", SemesterListCreateView.as_view()),
    path("semesters/<int:pk>/", SemesterDeleteView.as_view()),

    # ================= SUBJECTS =================
    path("subjects/", SubjectListCreateView.as_view()),
    path("subjects/<int:pk>/", SubjectDeleteView.as_view()),
]
