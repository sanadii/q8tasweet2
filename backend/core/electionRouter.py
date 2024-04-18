class ElectionRouter:
    """
    A router to control all database operations on models in the
    associated applications.
    """
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'electionData':
            return 'election_db'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'electionData':
            return 'election_db'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        # Add logic if necessary
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'electionData':
            return db == 'election_db'
        return None
