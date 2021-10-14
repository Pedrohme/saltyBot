CREATE TABLE fighter (
    name VARCHAR(256) NOT NULL,
    wins INT,
    losses INT,
    PRIMARY KEY(name)
)

CREATE TABLE fights (
    id SERIAL,
    fightera VARCHAR(256) NOT NULL,
    fighterb VARCHAR(256) NOT NULL,
    winner VARCHAR(256),
    FOREIGN KEY(fightera) REFERENCES fighter(name)
        ON UPDATE CASCADE,
    FOREIGN KEY(fighterb) REFERENCES fighter(name)
        ON UPDATE CASCADE,
    FOREIGN KEY(winner) REFERENCES fighter(name)
        ON UPDATE CASCADE,
    PRIMARY key(id)
)