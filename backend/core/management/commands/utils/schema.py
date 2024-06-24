from django.db import connection

def set_database_schema(schema_name, command):
    try:
        with connection.cursor() as cursor:
            command.stdout.write(f"Setting search path to schema: {schema_name}")
            cursor.execute(f"SET search_path TO {schema_name}")
        verify_schema_context(schema_name, command)
        if not verify_tables_exist(schema_name, command):
            return False
    except Exception as e:
        command.stdout.write(command.style.ERROR(f"Failed to set schema '{schema_name}': {e}\n"))
        return False
    return True

def verify_schema_context(schema_name, command):
    with connection.cursor() as cursor:
        cursor.execute("SHOW search_path")
        search_path = cursor.fetchone()
        command.stdout.write(f"Current search path: {search_path}\n")

def verify_tables_exist(schema_name, command):
    table_names = ['campaign_guarantee', 'elector', 'campaign_guarantee_group']
    for table_name in table_names:
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = '{schema_name}' 
                    AND table_name = '{table_name}'
                );
            """
            )
            table_exists = cursor.fetchone()[0]
            if not table_exists:
                command.stdout.write(
                    command.style.WARNING(
                        f"Table '{table_name}' does not exist in schema '{schema_name}'\n"
                    )
                )
                return False
    return True
