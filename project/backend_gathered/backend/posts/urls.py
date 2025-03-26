from django.urls import path
from .views import *

urlpatterns = [
    path('publish/', PublishPostView.as_view()),
    path('user/<int:user_id>/', UserPostsView.as_view()),
    path('<int:post_id>/upvote/', upvote_post),
    path('<int:post_id>/downvote/', downvote_post),
    path('purchase/<int:post_id>/', purchase_post),
    path('download/', download_attachment),
    path('<int:post_id>/', get_single_post),
    path('', PostListView.as_view()),
]

