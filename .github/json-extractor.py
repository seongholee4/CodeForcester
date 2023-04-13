import os
import json
import time
import itertools

import requests
import pandas as pd
import numpy as np
import re

import ssl
from io import StringIO

ssl._create_default_https_context = ssl._create_unverified_context

class BlacklistError(Exception):
    pass

def get_all_contests():
    """Fetch all the contests using codeforces api"""
    url = "https://codeforces.com/api/contest.list"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }

    res = requests.get(url, headers=headers)
    if res.status_code != 200:
        raise RuntimeError(f"Request status code : {res.status_code}. Try again!")
    res = res.json()
    if res["status"] != "OK":
        raise RuntimeError(f"Response from codeforces, status: {res['status']}")
    return res["result"]


def get_required_fields(contest, fields, as_fields):
    return {key: contest[field] for key, field in zip(as_fields, fields)}


def get_contest_division(contest):
    div = ""
    if contest["name"].find("Educational") >= 0:
        div = "E"
    elif contest["name"].find("Div. 1") >= 0:
        div = "1"
    elif contest["name"].find("Div. 2") >= 0:
        div = "2"
    elif contest["name"].find("Div. 3") >= 0:
        div = "3"
    return div


def replace_nan(x):
    if isinstance(x, str):
        return x
    if np.isnan(x):
        return None
    return x


def strip_x(x: str):
    if not isinstance(x, str):
        return x
    return x.strip('x').strip()


def get_problems(contest):
    idx = contest['id']
    print(f"\033[32mFetching problems for contest {idx}\033[0m") # green color for testing purposes
    url = f'https://codeforces.com/contest/{idx}'
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'}
    res = requests.get(url, headers=headers)
    
    if res.status_code != 200:
        raise BlacklistError(f"{idx} is blacklisted: Unable to fetch contest page (status code: {res.status_code}).")
    dataframes = pd.read_html(StringIO(res.text))
    df = None
    for temp_df in dataframes:
        if 'Name' in temp_df.columns:
            df = temp_df
            break
    if df is None:
        raise BlacklistError(f"{idx} is blacklisted: No 'Name' column found in DataFrame.")
    elif df.empty:
        raise BlacklistError(f"{idx} is blacklisted: DataFrame is empty.")

    df.dropna(axis=1, how='all', inplace=True)
    columns = ['idx', 'name', 'solved_count']
    df.columns = [columns[i] for i in range(len(df.columns))]
    indices = [str(val) for val in df['idx'].values]
    names = [name.split(" standard")[0].strip() if " standard"in name else name.strip() for name in df['name'].values]
    # names = [re.match(r'^(.*?)\s+standard', name).group(1) for name in df['name'].values]

    solved_count = []
    if 'solved_count' in df.columns:
        df['solved_count'] = df['solved_count'].apply(strip_x)
        solved_count = df['solved_count'].apply(replace_nan).values

    # Fetch problem ratings
    problemset_api = "https://codeforces.com/api/problemset.problems"
    try:
        problemset_res = requests.get(problemset_api)
        problemset_data = problemset_res.json()["result"]
    except (requests.exceptions.RequestException, ConnectionError):
        print(f"\033[31mUnable to fetch problemset for contest {idx}\033[0m") # red color for testing purposes
        problemset_data = get_problems_with_retry(problemset_api)

    problems_with_rating = {f"{p['contestId']}-{p['index']}": p['rating'] for p in problemset_data['problems'] if
                                'rating' in p}

    problems = []
    for problem_idx, name, count in zip(indices, names, solved_count):
        problem_key = f"{idx}-{problem_idx}"
        rating = problems_with_rating.get(problem_key, None)
        problems.append({"contestId": idx, "index": problem_idx, "name": name, "solvedCount": count, "rating": rating})

    return problems


def process_contests(contests):
    contest_data = []
    blacklisted = set()
    fields = ["id", "name", "startTimeSeconds"]
    as_fields = ["contestId", "name", "startTimeSeconds"]
    for idx, contest in enumerate(contests, start=1):
        # if idx == 10: # for testing purposes
        #     break
        time.sleep(0.2)
        c = get_required_fields(contest, fields=fields, as_fields=as_fields)
        c["div"] = get_contest_division(contest)
        try:
            c["problems"] = get_problems(contest)
        except BlacklistError:
            print(f"{idx} : {contest['id']} blacklisted!")
            blacklisted.add(contest["id"])
            continue
        contest_data.append(c)
        print(f"{idx} : {contest['id']} completed!")
    return (contest_data, blacklisted)

def filter_contest_by_id(contests, target_id):
    return [contest for contest in contests if contest["id"] == target_id]

def get_problems_with_retry(api, retries=3, delay=5):
    success = False
    
    for _ in range(retries):
        try:
            problemset_res = requests.get(api)
            problemset_res.raise_for_status()  # Raise an exception for HTTP errors
            success = True
            result = problemset_res.json()["result"]
            break
        except (requests.exceptions.RequestException, ConnectionError) as e:
            print(f"Request failed with error: {e}. Retrying in {delay} seconds...")
            time.sleep(delay)
    if not success:
        raise Exception("Failed to fetch problems after multiple retries.")
    
    return result

if __name__ == "__main__":
    FILENAME = "contests.json"

    # get all contests
    contests = get_all_contests()

    # select only completed ones
    contests = [contest for contest in contests if contest['phase'] != 'BEFORE']

    # remove processed contests
    processed_ids = set()
    blacklisted_ids = set()

    if os.path.exists(FILENAME):
        with open(FILENAME) as f:
            result = json.load(f)
        processed_contests = result.get('contests', [])
        processed_ids = {contest['contestId'] for contest in processed_contests}
        blacklisted_ids = {idx for idx in result.get('blacklisted', [])}
    else:
        with open(FILENAME, 'w') as file:
            file.write('{}')
        processed_contests = []
        print("File 'contests.json' created")
        # print("Current working directory:", os.getcwd()) # for testing purposes
        # print("Contents of the current working directory:", os.listdir()) # for testing purposes
    
    # select unprocessed contests
    # contests = [contest for contest in contests if contest['id'] not in processed_ids]
    target_contest_id = 988  # Set the target contestId for testing purposes [1308, 988]
    contests = filter_contest_by_id(contests, target_contest_id) # for testing purposes

    # filter blacklisted contests out, if TRY_BLACKLISTED env variable is not set
    if not os.environ.get('TRY_BLACKLISTED'):
        contests = [contest for contest in contests if contest['id'] not in blacklisted_ids]


    if not contests:
        print('No contests for processing')
        exit(1)

    print(f'Processing {len(contests)} new contests')
    new_contests, new_blacklisted_ids = process_contests(contests)

    print(f'Processed! {len(new_contests)} added and {len(new_blacklisted_ids)} blacklisted.')

    contests = processed_contests + new_contests
    blacklisted_ids =  blacklisted_ids.union(new_blacklisted_ids)

    contests_ids = {contest['contestId'] for contest in contests}
    blacklisted_ids = [idx for idx in blacklisted_ids if idx not in contests_ids]

    json_data = {"contests": contests, "blacklisted": blacklisted_ids}

    with open(FILENAME, "w") as f:
        json.dump(json_data, f)
