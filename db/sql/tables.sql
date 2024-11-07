///Investigador table
CREATE TABLE IF NOT EXISTS public.investigador
(
    id text COLLATE pg_catalog."default" NOT NULL,
    universidad text COLLATE pg_catalog."default" NOT NULL,
    departamento text COLLATE pg_catalog."default" NOT NULL,
    area text COLLATE pg_catalog."default",
    figura text COLLATE pg_catalog."default",
    miembro text COLLATE pg_catalog."default",
    nombre_autor text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "PRIMARY_KEY" PRIMARY KEY (id),
    CONSTRAINT investigador_id_id1_key UNIQUE (id)
        INCLUDE(id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.investigador
    OWNER to miguell;

/// proyecto
CREATE TABLE IF NOT EXISTS public.proyecto
(
    id text COLLATE pg_catalog."default" NOT NULL,
    codigo text COLLATE pg_catalog."default" NOT NULL,
    ip text COLLATE pg_catalog."default" NOT NULL,
    titulo text COLLATE pg_catalog."default" NOT NULL,
    financiado text COLLATE pg_catalog."default" NOT NULL,
    inicio date NOT NULL,
    fin date,
    CONSTRAINT proyecto_pkey PRIMARY KEY (id, ip),
    CONSTRAINT "UNIQUE_CODE" UNIQUE (codigo),
    CONSTRAINT proyecto_id_id1_key UNIQUE (id)
        INCLUDE(id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.proyecto
    OWNER to miguell;

/// participa
CREATE TABLE IF NOT EXISTS public.participa
(
    id_investigador text COLLATE pg_catalog."default" NOT NULL,
    id_proyecto text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT participa_pkey PRIMARY KEY (id_investigador, id_proyecto),
    CONSTRAINT participa_id_investigador_fkey FOREIGN KEY (id_investigador)
        REFERENCES public.investigador (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT participa_id_proyecto_fkey FOREIGN KEY (id_proyecto)
        REFERENCES public.proyecto (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.participa
    OWNER to miguell;
