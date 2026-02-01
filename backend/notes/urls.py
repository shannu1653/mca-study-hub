from django.urls import path
from .views import (
    NotesView,
    NoteDetailView,
    YearListCreateView,
    YearDeleteView,
    SemesterListCreateView,
    SemesterDeleteView,
    SubjectListCreateView,
    SubjectDeleteView,
)

urlpatterns = [
    # NOTES
    path("", NotesView.as_view()),
    path("<int:pk>/", NoteDetailView.as_view()),

    # YEARS
    path("years/", YearListCreateView.as_view()),
    path("years/<int:pk>/", YearDeleteView.as_view()),

    # SEMESTERS
    path("semesters/", SemesterListCreateView.as_view()),
    path("semesters/<int:pk>/", SemesterDeleteView.as_view()),

    # SUBJECTS
    path("subjects/", SubjectListCreateView.as_view()),
    path("subjects/<int:pk>/", SubjectDeleteView.as_view()),
]
