class ChallengesApiClient {
    static SERVER_URL = 'http://localhost:8000';
    static GET_CHALLENGE = '/challenges/random';
    static POST_RESULT = '/attempts';
    static GET_ATTEMPTS_BY_ALIAS = '/attempts?alias=';
    static GET_USERS_BY_IDS = '/users';

    static challenge(): Promise<Response> {
        return fetch(ChallengesApiClient.SERVER_URL + ChallengesApiClient.GET_CHALLENGE);
    }

    static sendGuess(
        user: String,
        a: Number,
        b: Number,
        guess: Number): Promise<Response> {
            return fetch(ChallengesApiClient.SERVER_URL + ChallengesApiClient.POST_RESULT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify (
                    {
                        userAlias: user,
                        factorA: a,
                        factorB: b,
                        guess: guess
                    }
                )
            });
        }   

    static getAttempt(userAlias: String): Promise<Response> {
        return fetch(ChallengesApiClient.SERVER_URL + ChallengesApiClient.GET_ATTEMPTS_BY_ALIAS + userAlias);
    }

    static getUsers(userIds: number[]): Promise<Response> {
        return fetch(ChallengesApiClient.SERVER_URL + ChallengesApiClient.GET_USERS_BY_IDS + '/' + userIds.join(','));
    }
}

export default ChallengesApiClient;