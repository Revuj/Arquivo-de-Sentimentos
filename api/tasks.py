from create_celery import make_celery

celery = make_celery(None)


@celery.task()
def do_in_background(*args):
    func = args[0]
    args = []
    if len(args) > 1:
        args = args[1:]
    return func(*args)
