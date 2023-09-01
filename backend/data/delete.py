import sqlite3

def delete_all_records(election_candidate):
    # Connect to the SQLite database
    conn = sqlite3.connect('db.sqlite3')
    cursor = conn.cursor()

    # Execute the DELETE statement
    cursor.execute(f'DELETE FROM {election_candidate}')

    # Commit the changes and close the connection
    conn.commit()
    conn.close()

# Usage example
delete_all_records('election_candidate')
