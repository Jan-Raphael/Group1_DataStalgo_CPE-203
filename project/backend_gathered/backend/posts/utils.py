def serialize_post(post):
    return {
        'id': post.id,
        'userId': post.user.id,
        'username': post.username,
        'title': post.title,
        'tags': post.tags,
        'description': post.description,
        'contentType': post.contentType,
        'price': float(post.price),
        'PostDate': post.PostDate,
        'upvotes': [u.id for u in post.upvotes.all()],
        'downvotes': [u.id for u in post.downvotes.all()],
        'purchase': [u.id for u in post.purchase.all()],
        'AttachmentCount': post.attachments.count(),
        'attachments': [a.file.name.split('/')[-1] for a in post.attachments.all()],
        'subscribers': [s.id for s in post.user.subscribers.all()],
    }
