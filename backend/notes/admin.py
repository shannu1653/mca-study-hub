from django.contrib import admin
from .models import Year, Semester, Subject, Note

admin.site.register(Year)
admin.site.register(Semester)
admin.site.register(Subject)
admin.site.register(Note)
