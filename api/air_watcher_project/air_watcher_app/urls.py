from django.urls import path
from strawberry.django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt
from .schema import watch_city_schema

urlpatterns = [
    path(
        "watch-cities/",
        csrf_exempt(
            GraphQLView.as_view(schema=watch_city_schema),
        ),
        name="watch cities graphql api",
    ),
]
