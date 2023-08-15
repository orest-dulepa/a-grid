import os

from google.cloud import bigquery
from google.cloud import error_reporting
from sklearn.preprocessing import StandardScaler

gcp_project = os.getenv('GCP_PROJECT', 'ag-edgekit-dev')

bq = bigquery.Client()
err_client = error_reporting.Client()
scaler = StandardScaler()

def get_audience_overlap(audience_id: str):
    sql = """
        SELECT *
        FROM `{gcp_project}.app.audience_overlap`
        WHERE audience_id = '{audience_id}'
        AND overlap_audience_id LIKE 'iab%'
    """.format(audience_id=audience_id, gcp_project=gcp_project)

    try:
        df = bq.query(sql).to_dataframe()

        if len(df) == 0:
            raise Exception(f'Audience overlap report for audience ID: {audience_id} is empty.')

        df['overlap'] = scaler.fit_transform(df['count'].values.reshape(-1, 1))
        df['overlap'] = df.overlap.round(2)
        df = df.sort_values('count', ascending=False)
        report_ts = df.head(1).inserted_at.to_list()[0].timestamp()
        df = df.drop(columns=['inserted_at', 'count', 'audience_id'])
        overlaps = df.to_dict('records')

    except:
        err_client.report_exception()

    return {
        'audience_id': audience_id,
        'report_ts': report_ts,
        'overlaps': overlaps
    }
