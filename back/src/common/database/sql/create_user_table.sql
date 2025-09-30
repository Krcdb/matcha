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
      verification_code VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE interests (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL
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

  -- Only create interests table data
  INSERT INTO interests (name) VALUES
          ('sports'),
          ('music'),
          ('travel'),
          ('coding');