CREATE TABLE IF NOT EXISTS players(
    playerId INTEGER PRIMARY KEY AUTO_INCREMENT,
    username TEXT NOT NULL,
    accountLevel INTEGER NULL,
    passwd TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS jobs(
    jobId INTEGER PRIMARY KEY AUTO_INCREMENT,
    jobName TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bots(
    botId INTEGER PRIMARY KEY AUTO_INCREMENT,
    username TEXT NOT NULL,
    jobId INTEGER NOT NULL,
    botLevel INTEGER NOT NULL,
    playerId INTEGER NOT NULL, 

    FOREIGN KEY(jobId) REFERENCES jobs(jobId),
    FOREIGN KEY(jobId) REFERENCES jobs(jobId)
);
