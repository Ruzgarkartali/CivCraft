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
    FOREIGN KEY(playerId) REFERENCES players(playerId)
);

CREATE TABLE IF NOT EXISTS actions(
    actionId INTEGER PRIMARY KEY AUTO_INCREMENT,
    actionName TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS canDo(
    actionId INTEGER,
    jobId INTEGER,

     FOREIGN KEY(jobId) REFERENCES jobs(jobId),
      FOREIGN KEY(actionId) REFERENCES actions(actionId)
   
);

 insert into actions(actionName) values('follow'),('mine'),('cutwood'),('farm'),('drop'),('come'),('defend'),('stop');
  insert into canDo values(2,1),(5,1),(6,1),(8,1),(1,1);
  insert into canDo values(3,2),(5,2),(6,2),(8,2),(1,2);
  insert into canDo values(3,2),(5,2),(6,2),(8,2),(1,2);
  insert into canDo values(4,3),(5,3),(6,3),(8,3),(1,3);
   insert into canDo values(7,4),(5,4),(6,4),(8,4),(1,4);