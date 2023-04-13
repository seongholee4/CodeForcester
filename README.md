# CodeForcester
Streamline your competitive programming with this intuitive CodeForces tracker. Easily track submissions, problem status, and contest updates. Improve problem-solving skills and monitor progress. Harness the power of CodeForcester for a smoother programming contest experience.

230410
Modify the list comprehension in the problems line to include the name of each problem and contestId (contests.json)
```
problems = [
    {"contestId": idx, "index": problem_idx, "name": name, "solvedCount": count}
    for problem_idx, name, count in zip(indices, names, solved_count)
]
```

TODO:
- With json-extractor.py, learn how to use Git Actions Workflow to periodically update contests.json.
- Connect
