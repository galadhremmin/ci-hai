TRUNCATE TABLE `languages`;

INSERT INTO `languages` (`name`, `order`, `is_invented`, `category`, `is_unusual`) VALUES
    ('Simplified', 10, 0, 'Mandarin', 0),
    ('Traditional', 20, 0, 'Mandarin', 0);

INSERT INTO `roles` (`name`) VALUES 
    ('Administrator'), ('User');