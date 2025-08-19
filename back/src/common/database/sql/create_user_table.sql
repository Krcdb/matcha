  CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      fortytwo_id VARCHAR(255) UNIQUE,
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(255) UNIQUE NOT NULL,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,  
      birthdate DATE NOT NULL,
      gender VARCHAR(255) NOT NULL,
      sexual_preferences VARCHAR(255) NOT NULL,
      fame_rating INT DEFAULT 0,
      biography VARCHAR(255),
      is_verified BOOLEAN DEFAULT false,
      verification_code INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE interests (
      id SERIAL PRIMARY KEY,
      name  VARCHAR(255) UNIQUE NOT NULL
  );

  CREATE TABLE users_interests (
    user_id INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    interest_id INT NOT NULL REFERENCES interests (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, interest_id)
  );

  CREATE TABLE liked (
    liker INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    liked INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (liker, liked)
  );

  CREATE TABLE viewed (
    viewer INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    viewed INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (viewer, viewed)
  );

  CREATE TABLE blocked (
    blocker INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    blocked INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (blocker, blocked)
  );

  CREATE TABLE reported (
    reporter INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    reported INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (reporter, reported)
  );

  CREATE TABLE connected (
    user_id INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    connected INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, connected)
  );

  CREATE TABLE profile_picture (
      id INT PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
      picture VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE users_picture (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users (id) ON DELETE CASCADE,
      picture VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );



  INSERT INTO interests (name) VALUES
          ('sports'),
          ('music'),
          ('travel'),
          ('coding');
            
  INSERT INTO users (fortytwo_id, email, username, first_name, last_name, password, birthdate, gender, sexual_preferences, biography, is_verified)
  VALUES
    ('42_001', 'alice@example.com', 'alice42', 'Alice', 'Dupont', 'pass123', '1995-04-12', 'female', 'male', 'Love adventures and coding', true),
    ('42_002', 'bob@example.com', 'bob42', 'Bob', 'Martin', 'pass123', '1992-08-21', 'male', 'female', 'Music is my life', false),
    ('42_003', 'charlie@example.com', 'charlie42', 'Charlie', 'Durand', 'pass123', '1990-01-05', 'male', 'female', 'Traveler and foodie', true),
    ('42_004', 'diana@example.com', 'diana42', 'Diana', 'Leroy', 'pass123', '1998-07-30', 'female', 'male', 'Fitness enthusiast', false);
      
  INSERT INTO users_interests (user_id, interest_id) VALUES
    (1, 1), -- sports
    (1, 4); -- coding
      
  INSERT INTO users_interests (user_id, interest_id) VALUES
    (2, 2); -- music
      
  INSERT INTO interests (name) VALUES ('food');
  INSERT INTO users_interests (user_id, interest_id) VALUES
    (3, 3), -- travel
    (3, 5); -- food
      
  INSERT INTO interests (name) VALUES ('fitness');
  INSERT INTO users_interests (user_id, interest_id) VALUES
    (4, 1), -- sports
    (4, 6); -- fitness
      
  INSERT INTO profile_picture (id, picture)
  VALUES
    (1, '/images/alice_profile.jpg'),
    (2, '/images/bob_profile.jpg'),
    (3, '/images/charlie_profile.jpg'),
    (4, '/images/diana_profile.jpg');
      
  INSERT INTO users_picture (user_id, picture) VALUES
    (1, '/images/alice1.jpg'),
    (1, '/images/alice2.jpg'),
    (2, '/images/bob1.jpg'),
    (3, '/images/charlie1.jpg'),
    (3, '/images/charlie2.jpg'),
    (3, '/images/charlie3.jpg'),
    (4, '/images/diana1.jpg');

  -- Alice like Bob et Charlie
  INSERT INTO liked (liker, liked) VALUES
    (1, 2),
    (1, 3);

  -- Bob like Diana
  INSERT INTO liked (liker, liked) VALUES
    (2, 4);

  -- Charlie like Alice
  INSERT INTO liked (liker, liked) VALUES
    (3, 1);

  -- Diana like Bob
  INSERT INTO liked (liker, liked) VALUES
    (4, 2);


  -- Alice a vu Bob et Diana
  INSERT INTO viewed (viewer, viewed) VALUES
    (1, 2),
    (1, 4);

  -- Bob a vu Alice
  INSERT INTO viewed(viewer, viewed) VALUES
    (2, 1);

  -- Charlie a vu Alice et Diana
  INSERT INTO viewed (viewer, viewed) VALUES
    (3, 1),
    (3, 4);

  -- Diana a vu tout le monde
  INSERT INTO viewed (viewer, viewed) VALUES
    (4, 1),
    (4, 2),
    (4, 3);


  -- Alice bloque Charlie
  INSERT INTO blocked (blocker, blocked) VALUES
    (1, 3);

  -- Bob bloque personne


  -- Charlie bloque Diana
  INSERT INTO blocked (blocker, blocked) VALUES
    (3, 4);

  -- Diana bloque Alice
  INSERT INTO blocked (blocker, blocked) VALUES
    (4, 1);


  -- Alice reporte Bob
  INSERT INTO reported (reporter, reported) VALUES
    (1, 2);

  -- Bob reporte Charlie
  INSERT INTO reported (reporter, reported) VALUES
    (2, 3);

  -- Charlie reporte Diana
  INSERT INTO reported (reporter, reported) VALUES
    (3, 4);

  -- Diana reporte Alice
  INSERT INTO reported (reporter, reported) VALUES
    (4, 1);