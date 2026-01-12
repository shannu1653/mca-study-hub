from django.urls import path
from .views import (
    NotesView,
    YearListCreateView,
    YearDeleteView,
    SemesterListCreateView,
    SemesterDeleteView,
    SubjectListCreateView,
    SubjectDeleteView,NoteDetailView,increase_download,
)


urlpatterns = [
    # Notes (GET = users, POST = admin)
    path("", NotesView.as_view()),

    # Years
    path("years/", YearListCreateView.as_view()),
    path("years/<int:pk>/", YearDeleteView.as_view()),

    # Semesters
    path("semesters/", SemesterListCreateView.as_view()),
    path("semesters/<int:pk>/", SemesterDeleteView.as_view()),

    # Subjects
    path("subjects/", SubjectListCreateView.as_view()),
    path("subjects/<int:pk>/", SubjectDeleteView.as_view()),
   path("<int:pk>/", NoteDetailView.as_view()),
   path("notes/<int:pk>/download/", increase_download),


]
