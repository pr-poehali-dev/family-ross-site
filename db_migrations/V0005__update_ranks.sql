UPDATE members SET rank = 'Лидер', rank_color = 'text-orange-400' WHERE rank IN ('Основатель');
UPDATE members SET rank = 'Старший состав', rank_color = 'text-gray-300' WHERE rank IN ('Капитан');
UPDATE members SET rank = 'Младший состав', rank_color = 'text-gray-400' WHERE rank IN ('Солдат');
UPDATE members SET rank = 'Стажёр', rank_color = 'text-gray-500' WHERE rank IN ('Стажер', 'Стажёр');
