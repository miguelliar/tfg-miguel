///Investigador table
CREATE TABLE IF NOT EXISTS public.investigador
(
    email text COLLATE pg_catalog."default" NOT NULL,
    nombre text COLLATE pg_catalog."default",
    apellidos text COLLATE pg_catalog."default",
    figura text COLLATE pg_catalog."default",
    area text COLLATE pg_catalog."default",
    departamento text COLLATE pg_catalog."default",
    universidad text COLLATE pg_catalog."default",
    CONSTRAINT "EMAIL_PK" PRIMARY KEY (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.investigador
    OWNER to miguell;

/// proyecto
CREATE TABLE IF NOT EXISTS public.proyecto
(
    codigo text COLLATE pg_catalog."default" NOT NULL,
    ip text COLLATE pg_catalog."default" NOT NULL,
    coip text COLLATE pg_catalog."default",
    titulo text COLLATE pg_catalog."default" NOT NULL,
    financiado text COLLATE pg_catalog."default" NOT NULL,
    inicio date NOT NULL,
    fin date,
    CONSTRAINT "CODIGO_PK" PRIMARY KEY (codigo)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.proyecto
    OWNER to miguell;

/// participa
CREATE TABLE IF NOT EXISTS public.participa
(
    codigo_proyecto text COLLATE pg_catalog."default" NOT NULL,
    email_investigador text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "PARTICIPA_PK" PRIMARY KEY (codigo_proyecto, email_investigador),
    CONSTRAINT "INVESTIGADOR_PK" FOREIGN KEY (email_investigador)
        REFERENCES public.investigador (email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "PROYECTO_PK" FOREIGN KEY (codigo_proyecto)
        REFERENCES public.proyecto (codigo) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.participa
    OWNER to miguell;

/// nombre_autor
CREATE TABLE public.nombre_autor
(
    email_investigador text NOT NULL,
    nombre_autor text NOT NULL,
    CONSTRAINT "PK" PRIMARY KEY (email_investigador, nombre_autor),
    CONSTRAINT "INVESTIGADOR_FK" FOREIGN KEY (email_investigador)
        REFERENCES public.investigador (email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE IF EXISTS public.nombre_autor
    OWNER to miguell;
