from django.db import models
from django.urls import reverse
from django.template.defaultfilters import slugify

from tinymce.models import HTMLField


class Subject(models.Model):
    name = models.CharField(max_length=200, help_text="Enter a subject of article")
    annotation = models.CharField(max_length = 500, help_text = 'Enter brief introduction to subject', null = True)
    slug = models.SlugField(editable=False)
    parent_subject = models.ForeignKey('self',null=True, on_delete=models.CASCADE, blank= True)

    def save(self):
        if not self.slug:
            slug = slugify(self.name)
            i = 0
            while True:
                try:
                    subject = Subject.objects.get(slug=slug)
                    i += 1
                    if subject == self:
                        self.slug = slug
                        break
                    else:
                        slug = slug + '-'
                except:
                    if i == 0:
                        self.slug = slug
                    else:
                        self.slug = slug + str(i)
                    break

        super(Subject, self).save()


    class Meta:
        ordering = ['name']


    def articles_length(self):
        print('CHECKING')
        try:
            num = Article.objects.filter(subject=self.pk).count()
        except Article.DoesNotExist:
            return 0
        print(num)

        return num

    def recent_articles(self):
        try:
            articles = Article.objects.filter(subject=self.pk)[:4]
        except Article.DoesNotExist:
            return None
        return articles

    def __str__(self):
        return self.name


class Article(models.Model):
    title = models.CharField(max_length=200)
    summary = HTMLField()
    subject = models.ManyToManyField(Subject, help_text="Select a subject for this article")
    date_of_publish = models.DateField(null=True, blank=True)
    num_views = models.IntegerField(default=0)
    slug = models.SlugField(editable=False)
    brief_introduction = models.CharField(max_length = 200, null=True)


    class Meta:
        ordering = ['-date_of_publish','title']

    def increment_views(self):
        self.num_views += 1
        self.save()
        return ''

    def save(self):
        if not self.slug:
            slug = slugify(self.title)
            i = 0
            while True:
                try:
                    article = Article.objects.get(slug=slug)
                    i += 1
                    if article == self:
                        self.slug = slug
                        break
                    else:
                        slug = slug + '-'
                except:
                    if i == 0:
                        self.slug = slug
                    else:
                        self.slug = slug + str(i)
                    break

        super(Article, self).save()

    def __str__(self):
        return self.title

    def display_subject(self):
        return ', '.join([subject.name for subject in self.subject.all()[:3]])

    display_subject.short_description = 'Subject'

    def get_absolute_url(self):
        """
        Returns the url to access a particular article instance.
        """
        return reverse('article-detail', args=[str(self.id)])


class Comment(models.Model):
    article = models.ForeignKey(Article,on_delete=models.CASCADE) # What article it refers to
    author = models.CharField(max_length=200, help_text = 'Enter your name', blank=False)
    text = models.CharField(max_length=200, help_text = 'Enter the text of comment', blank=False)
    date_of_publish = models.DateTimeField(auto_now_add=True, blank=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        parent_link=True,
        related_name='children',
        null=True,
        blank=True)

    def __str__(self):
        return f"{self.author}: {self.text}"