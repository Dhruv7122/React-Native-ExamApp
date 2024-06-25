import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'ExamManagement.db',
    location: 'default',
  },
  () => {
    console.log('Database opened successfully');
  },
  error => {
    console.log(error);
  },
);

export const createTables = () => {
  db.transaction(txn => {
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        phoneno TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        profileimage TEXT
      );`,
      [],
      () => {
        console.log('users table created successfully');
      },
      error => {
        console.log('Error creating users table: ' + error.message);
      },
    );

    txn.executeSql(
      `Select * from Users where role = ?`,
      ['admin'],
      (_, results) => {
        if (results.rows.length == 0) {
          // Inserting a sample user
          txn.executeSql(
            `INSERT INTO users (username, phoneno, password, role) VALUES (?, ?, ?, ?);`,
            ['admin', '1234567890', 'admin', 'admin'],
            () => {
              console.log('User inserted successfully');
            },
            error => {
              console.log('Error inserting user: ' + error.message);
            },
          );
        }
        console.log('admin already available');
      },
      error => {
        console.log('Error inserting user: ' + error.message);
      },
    );

    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT,
        answer1 TEXT,
        answer2 TEXT,
        answer3 TEXT,
        answer4 TEXT,
        correct_answer INTEGER
      );`,
      [],
      () => {
        console.log('Questions table created successfully');
      },
      error => {
        console.log('Error creating questions table: ' + error.message);
      },
    );

    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS Answers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          question_id INTEGER,
          selected_option INTEGER,
          is_correct INTEGER,
          UNIQUE(user_id, question_id),
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (question_id) REFERENCES questions(id)
        );`,
      [],
      () => {
        console.log(
          'Answers table created successfully with unique constraint',
        );
      },
      error => {
        console.log('Error creating answers table: ' + error.message);
      },
    );
  });
};

export const insertUser = (
  username,
  phoneno,
  password,
  profileImage,
  successCallback,
  errorCallback,
) => {
  console.log('Inserting user:', username, password, phoneno, profileImage);

  if (!db) {
    console.error('Database is not initialized');
    errorCallback('Database is not initialized');
    return;
  }

  db.transaction(
    tx => {
      tx.executeSql(
        'INSERT INTO users (username, phoneno, password, profileimage, role) VALUES (?, ?, ?, ?, ?)',
        [
          username,
          phoneno,
          password,
          profileImage,
          'user',
        ],
        (_, result) => {
          console.log('User inserted successfully', result);
          successCallback(result);
        },
        (_, error) => {
          console.error('Error inserting user: ', error);
          errorCallback(error);
        },
      );
    },
    error => {
      console.error('Transaction error: ', error);
      errorCallback(error);
    },
    () => {
      console.log('Transaction complete');
    },
  );
};

export const authenticateUser = (
  username,
  password,
  successCallback,
  errorCallback,
) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password],
      (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        console.log('Query results: ', temp);
        successCallback(temp);
      },
      (_, error) => errorCallback(error),
    );
  });
};

export const fetchUsers = (successCallback, errorCallback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM users',
      [],
      (_, result) => successCallback(result.rows.raw()),
      (_, error) => errorCallback(error),
    );
  });
};

export const updateUser = (
  id,
  username,
  phoneno,
  password,
  profileImage,
  successCallback,
  errorCallback,
) => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE users SET username = ?, phoneno = ?, password = ?, profileimage = ? WHERE id = ?',
      [username, phoneno, password, profileImage, id],
      (_, result) => successCallback(result),
      (_, error) => errorCallback(error),
    );
  });
};

export const deleteUser = (id, successCallback, errorCallback) => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM users WHERE id = ?',
      [id],
      (_, result) => successCallback(result),
      (_, error) => errorCallback(error),
    );
  });
};

export const addQuestion = (
  question,
  answer1,
  answer2,
  answer3,
  answer4,
  correctAnswer,
  successCallback,
  errorCallback,
) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO questions (question, answer1, answer2, answer3, answer4, correct_answer) VALUES (?, ?, ?, ?, ?, ?)',
      [question, answer1, answer2, answer3, answer4, correctAnswer],
      (tx, result) => {
        successCallback(result);
      },
      (tx, error) => {
        errorCallback(error);
      },
    );
  });
};

export const getQuestions = (successCallback, errorCallback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM questions',
      [],
      (tx, results) => {
        let questions = [];
        for (let i = 0; i < results.rows.length; ++i) {
          questions.push(results.rows.item(i));
        }
        successCallback(questions);
      },
      (tx, error) => {
        errorCallback(error);
      },
    );
  });
};

export const deleteQuestion = (id, successCallback, errorCallback) => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM questions WHERE id = ?',
      [id],
      (tx, result) => {
        successCallback(result);
      },
      (tx, error) => {
        errorCallback(error);
      },
    );
  });
};

export const getUserProfile = (userId, successCallback, errorCallback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM users WHERE id = ?',
      [userId],
      (tx, results) => {
        if (results.rows.length > 0) {
          successCallback(results.rows.item(0));
        } else {
          errorCallback('User not found');
        }
      },
      (_, error) => errorCallback(error),
    );
  });
};

// export const addAnswer = (userId, questionId, selectedOption, isCorrect, successCallback, errorCallback) => {
//   console.log('Adding answer:', { userId, questionId, selectedOption, isCorrect });
//   // console.log(userId);
//   db.transaction(txn => {
//     txn.executeSql(
//       'INSERT INTO answers (user_id, question_id, selected_option, is_correct) VALUES (?, ?, ?, ?)',
//       [userId, questionId, selectedOption, isCorrect],
//       (_, result) => {
//         console.log('Answer added successfully:', result);
//         successCallback(result);
//       },
//       (txn, error) => {
//         console.log('Error adding answer:', error);
//         errorCallback(error);
//       }
//     );
//   });
// };

export const addAnswer = (
  userId,
  questionId,
  selectedOption,
  isCorrect,
  successCallback,
  errorCallback,
) => {
  console.log('Adding answer:', {
    userId,
    questionId,
    selectedOption,
    isCorrect,
  });

  if (!db) {
    console.error('Database connection is not initialized.');
    errorCallback('Database connection is not initialized.');
    return;
  }

  db.transaction(
    txn => {
      txn.executeSql(
        'INSERT INTO Answers (user_id, question_id, selected_option, is_correct) VALUES (?, ?, ?, ?)',
        [userId, questionId, selectedOption, isCorrect],
        (txn, result) => {
          console.log('Answer added successfully:', result);
          if (typeof successCallback === 'function') {
            successCallback(result);
          } else {
            console.warn('successCallback is not a function.');
          }
        },
        (txn, error) => {
          // console.error('Error adding answer:', error);
          if (typeof errorCallback === 'function') {
            errorCallback(error);
          } else {
            console.warn('errorCallback is not a function.');
          }
          return true; // returning true indicates that the error has been handled
        },
      );
    },
    txnError => {
      console.error('Transaction error:', txnError);
      if (typeof errorCallback === 'function') {
        errorCallback(txnError);
      } else {
        console.warn('errorCallback is not a function.');
      }
    },
  );
};

export const checkTestSubmission = (userId, successCallback, errorCallback) => {
  db.transaction(txn => {
    txn.executeSql(
      'SELECT COUNT(*) as count FROM answers WHERE user_id = ?',
      [userId],
      (txn, result) => {
        const isSubmitted = result.rows.item(0).count > 0;
        successCallback(isSubmitted);
      },
      (txn, error) => {
        console.error('Error checking test submission:', error);
        errorCallback(error);
      },
    );
  });
};

export const deleteOldAnswers = (userId, successCallback, errorCallback) => {
  db.transaction(txn => {
    txn.executeSql(
      'DELETE FROM answers WHERE user_id = ?',
      [userId],
      (txn, result) => {
        successCallback(result);
      },
      (txn, error) => {
        console.error('Error deleting old answers:', error);
        errorCallback(error);
      },
    );
  });
};

// Fetch users who have submitted the test
export const getUsersWithSubmissions = (successCallback, errorCallback) => {
  db.transaction(txn => {
    txn.executeSql(
      'SELECT DISTINCT users.id, users.username, users.profileimage FROM answers JOIN users ON answers.user_id = users.id',
      [],
      (txn, result) => {
        const users = [];
        for (let i = 0; i < result.rows.length; i++) {
          users.push(result.rows.item(i));
        }
        successCallback(users);
      },
      (txn, error) => {
        console.error('Error fetching users with submissions:', error);
        errorCallback(error);
      },
    );
  });
};

// Fetch report of a specific user
export const getUserReport = (userId, successCallback, errorCallback) => {
  db.transaction(txn => {
    txn.executeSql(
      `SELECT questions.question, answers.selected_option, questions.correct_answer 
       FROM answers 
       JOIN questions ON answers.question_id = questions.id 
       WHERE answers.user_id = ?`,
      [userId],
      (txn, result) => {
        const report = [];
        for (let i = 0; i < result.rows.length; i++) {
          report.push(result.rows.item(i));
        }
        successCallback(report);
      },
      (txn, error) => {
        console.error('Error fetching user report:', error);
        errorCallback(error);
      },
    );
  });
};

export default db;
