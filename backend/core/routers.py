from threading import local

request_cfg = local()

class ElectionRouter:
    def db_for_read(self, model, **hints):
        return getattr(request_cfg, 'db_name', 'default')

    def db_for_write(self, model, **hints):
        return getattr(request_cfg, 'db_name', 'default')
