import urllib3

MLB_API_ENDPOINT = 'https://statsapi.mlb.com/api/v1.1'


def top_performers(gamePk: int, timecode: str):
    http = urllib3.PoolManager()
    url = f'{MLB_API_ENDPOINT}/game/{gamePk}/feed/live?timecode={timecode}'
    resp = http.request('GET', url).json()
    return resp['liveData']['boxscore']['topPerformers']


def plays(gamePk: int, timecode: str):
    http = urllib3.PoolManager()
    url = (f'{MLB_API_ENDPOINT}/game/{gamePk}/feed/live?timecode={timecode}&fields=liveData,plays,allPlays,result,'
           f'description,event,eventType,isOut,about,startTime,endTime,isComplete')
    return http.request('GET', url).json()


def plays_diff(gamePk: int, timecode1: str, timecode2: str):
    if int(timecode1.replace('_', '')) > int(timecode2.replace('_', '')):
        timecode1, timecode2 = timecode2, timecode1

    timecode1_plays = plays(gamePk, timecode1)['liveData']['plays']['allPlays']
    timecode2_plays = plays(gamePk, timecode2)['liveData']['plays']['allPlays']

    if len(timecode1_plays) == 0:
        return timecode2_plays

    diff_plays = []
    for play in timecode2_plays[::-1]:
        if play['about']['startTime'] == timecode1_plays[-1]['about']['startTime']:
            return diff_plays
        else:
            diff_plays.append(play)

    return diff_plays
