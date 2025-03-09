INSERT INTO proyecto (codigo, ip, coip, titulo, financiado, inicio, fin) 
values 
('2021/00008/023', 'Carmen R. M.', NULL, 'Validador de proyectos en linea', 'CONSEJERIA DE CIENCIA, INNOVACION Y UNIVERSIDAD DEL PA', '2020-02-01', NULL),
('2019/00023/004', 'Miguel L. A.', 'Carmen R. M.', 'Analizar los sesgos de la IA con IA', 'CONSEJERIA DE CIENCIA, INNOVACION Y UNIVERSIDAD DEL PA', '2023-10-12', NULL),
('2020/00145/029', 'Elias L.', NULL, 'Entorno para el análisis de informacion', 'CONSEJERIA DE CIENCIA, INNOVACION Y UNIVERSIDAD DEL PA', '2022-03-29', NULL),
('2015/00059/012', 'Pablo L. A.', NULL, 'Estudio de impacto sobre el ocio en la salud mental', 'CONSEJERIA DE EDUCACION Y CULTURA', '2013-04-05', NULL),
('2021/00103/033', 'RICO PACHON, NOELIA', NULL, 'Analisis de los cambios de acidez sobre el oceano', 'CONSEJERIA DE EDUCACION Y CULTURA', '2009-01-16', '2012-02-18'),
('2022/00214/014', 'Andrea L.', NULL, 'Estudio historico de los conflictos coloniales en Africa', 'CONSEJERIA DE HISTORIA Y UNIVERSIDAD DEL PA', '2003-11-23', '2015-11-23');

INSERT INTO investigador (email, nombre, apellidos, universidad, departamento, area, figura)
values
('carmenr@uniovi.es', 'Carmen', 'Rendueles Marin', 'Universidad de Oviedo', 'Informatica', 'Informatica', 'AYD'),
('miguell@unileon.es', 'Miguel', 'Lopez Arbesu', 'Universidad de Leon', 'Estadistica', 'Estadistica', 'TU'),
('eliasl@unisev.es', 'Elias', 'Lieres Campos', 'Universidad de Sevilla', 'Matematicas', 'Matematicas', 'AYD'),
('pablola@unival.es', 'Pablo', 'Ligero Amado', 'Universidad de Valencia', 'Psicologia', 'Psicologia', 'TU'),
('noeliarico@londuni.uk', 'Noelia', 'Rodriguez Perez', 'London University', 'Biology', 'Biology', 'AYD'),
('andreal@uninav.es', 'Andrea', 'Llera Misiego', 'Universidad de Navarra', 'Historia', 'Historia', 'TU');

INSERT INTO nombre_autor (email_investigador, nombre_autor)
values
('carmenr@uniovi.es', 'Carmen R. M.'),
('miguell@unileon.es', 'Miguel L. A.'),
('eliasl@unisev.es', 'Elias L.'),
('pablola@unival.es', 'Pablo L. A.'),
('noeliarico@londuni.uk', 'RICO PACHON, NOELIA'),
('andreal@uninav.es', 'Andrea L.');


INSERT INTO participa (codigo_proyecto, email_investigador, nombre_autor)
values
('2021/00008/023', 'carmenr@uniovi.es', 'Carmen R. M.'),
('2019/00023/004', 'miguell@unileon.es', 'Miguel L. A.'),
('2020/00145/029', 'eliasl@unisev.es', 'Elias L.'),
('2015/00059/012', 'pablola@unival.es', 'Pablo L. A.'),
('2021/00103/033', 'noeliarico@londuni.uk', 'RICO PACHON, NOELIA'),
('2022/00214/014', 'andreal@uninav.es', 'Andrea L.');