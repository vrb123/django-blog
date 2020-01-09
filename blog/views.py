from django.shortcuts import render,get_object_or_404,get_list_or_404
from django.http import HttpResponse,Http404,JsonResponse

from .models import Article,Comment,Subject

from django.views.decorators.csrf import csrf_exempt


import json


# forms
from .forms import CommentForm

# For class-view components
from django.views import generic

def index(request):
    most_popular_articles = get_list_or_404(Article.objects.order_by('-num_views'))[:4]
    return render(request,'blog/home_page.html',{
        'most_popular_articles': most_popular_articles
    })


class SubjectListView(generic.ListView):
    model = Subject
    queryset = Subject.objects.filter(parent_subject=None)
    paginate_by = 10


class SubjectDetailView(generic.DetailView):
    model = Subject


class ArticleListView(generic.ListView):
    model = Article
    paginate_by = 1


class ArticleDetailView(generic.DetailView):
    model = Article


class ArticleListBySlugView(generic.ListView):
    
    paginate_by = 1
    template_name = 'blog/articles_by_subject_slug.html'
    context_object_name = 'article_list'

    def get_queryset(self):
        self.subject = get_object_or_404(Subject, slug=self.kwargs['slug'])
        return Article.objects.filter(subject=self.subject)


@csrf_exempt
def post_comment(request,slug):
    print('Got there finally')
    article = get_object_or_404(Article,slug = slug)

    if request.method == 'POST':
        
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        print(body)
        
        form = CommentForm(data=body)

        
        
        if form.is_valid():
            comment = form.save(commit = False)
            comment.article = article
            comment.save()
            return JsonResponse({
                'success': True,
                'pk': comment.pk,
                'date_of_publish': comment.date_of_publish.strftime("%Y-%m-%d %H:%M:%S"),
                'status_code':200
            })
        else:
            pass
            # print(form.cleaned_data)
            # print(form.data['author'])
    return JsonResponse({
        'success': False,
        'status_code':401
    })