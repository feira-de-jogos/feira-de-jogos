INSERT INTO people(name, email, operator) VALUES (true, 'Banco Central', 'feiradejogosifscsaojose@gmail.com', true);
INSERT INTO operations(to, value, date, completed) VALUES ((SELECT id FROM people WHERE name = 'Banco Central'), 1000000, NOW(), true);
