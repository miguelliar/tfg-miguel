INSERT INTO proyecto (id, codigo, ip, titulo, financiado, inicio, fin) 
values 
('1', '1', 'Carmen R. M.', 'Validador de proyectos en linea', 'publica', '2020-02-01', NULL),
('2', '2', 'Miguel L. A.', 'Analizar los sesgos de la IA con IA', 'privada', '2023-10-12', NULL),
('3', '3', 'Elias L.', 'Entorno para el análisis de informacion', 'publica', '2022-03-29', NULL),
('4', '4', 'Pablo L. A.', 'Estudio de impacto sobre el ocio en la salud mental', 'privada', '2013-04-05', NULL),
('5', '5', 'Noelia R. P.', 'Analisis de los cambios de acidez sobre el oceano', 'privada', '2009-01-16', NULL),
('6', '6', 'Andrea L.', 'Estudio historico de los conflictos coloniales en Africa', 'publica', '2003-11-23', NULL);

INSERT INTO investigador (id, nombre_autor, universidad, departamento, area, figura, miembro)
values
('1', 'Carmen R. M.', 'Universidad de Oviedo', 'Informatica', 'Informatica', 'AYD', 'Universidad de Oviedo'),
('2', 'Miguel L. A.', 'Universidad de Leon', 'Estadistica', 'Estadistica', 'TU', 'Universidad de Leon'),
('3', 'Elias L.', 'Universidad de Sevilla', 'Matematicas', 'Matematicas', 'AYD', 'Universidad de Sevilla'),
('4', 'Pablo L. A.', 'Universidad de Valencia', 'Psicologia', 'Psicologia', 'TU', 'Universidad de Valencia'),
('5', 'Noelia R. P.', 'London University', 'Biology', 'Biology', 'AYD', 'London University'),
('6', 'Andrea L.', 'Universidad de Navarra', 'Historia', 'Historia', 'TU', 'Universidad de Navarra');

INSERT INTO participa (id_investigador, id_proyecto)
values
('1', '1'),
('2', '2'),
('3', '3'),
('4', '4'),
('5', '5'),
('6', '6');