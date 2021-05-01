from celery import Celery


celery_obj = None
def make_celery(app):

    global celery_obj
    if celery_obj is not None:
        return celery_obj
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_BROKER_URL'],
        broker=app.config['CELERY_BROKER_URL']
    )
    celery.conf.update(app.config)

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    celery_obj = celery
    return celery_obj
