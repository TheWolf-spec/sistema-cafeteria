--
-- PostgreSQL database dump
--

\restrict aKjyrlB0VRnlgGdL0CBDK6nr9o7lRDZab6O6T2FBTJeVSHvmId3LbdsiO4nPHvV

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2025-11-23 12:49:44

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 24594)
-- Name: auditoria_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auditoria_logs (
    id integer NOT NULL,
    usuario_id integer,
    accion character varying(255) NOT NULL,
    detalle text,
    fecha_hora timestamp with time zone DEFAULT now()
);


ALTER TABLE public.auditoria_logs OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24593)
-- Name: auditoria_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auditoria_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auditoria_logs_id_seq OWNER TO postgres;

--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 223
-- Name: auditoria_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auditoria_logs_id_seq OWNED BY public.auditoria_logs.id;


--
-- TOC entry 230 (class 1259 OID 32769)
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    id integer NOT NULL,
    nombre_completo character varying(255) NOT NULL,
    ci character varying(50) NOT NULL,
    visitas integer DEFAULT 0
);


ALTER TABLE public.clientes OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 32768)
-- Name: clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clientes_id_seq OWNER TO postgres;

--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 229
-- Name: clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;


--
-- TOC entry 228 (class 1259 OID 24622)
-- Name: pedido_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedido_items (
    id integer NOT NULL,
    pedido_id integer NOT NULL,
    producto_id integer NOT NULL,
    cantidad integer NOT NULL,
    precio_unitario numeric(10,2) NOT NULL
);


ALTER TABLE public.pedido_items OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 24621)
-- Name: pedido_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pedido_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pedido_items_id_seq OWNER TO postgres;

--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 227
-- Name: pedido_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedido_items_id_seq OWNED BY public.pedido_items.id;


--
-- TOC entry 226 (class 1259 OID 24611)
-- Name: pedidos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedidos (
    id integer NOT NULL,
    fecha_hora timestamp with time zone DEFAULT now(),
    total numeric(10,2) NOT NULL,
    estado character varying(50) DEFAULT 'Recibido'::character varying,
    cliente_id integer,
    metodo_pago character varying(50)
);


ALTER TABLE public.pedidos OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24610)
-- Name: pedidos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pedidos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pedidos_id_seq OWNER TO postgres;

--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 225
-- Name: pedidos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedidos_id_seq OWNED BY public.pedidos.id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    descripcion text,
    precio numeric(10,2) NOT NULL,
    categoria character varying(100) NOT NULL,
    disponible boolean DEFAULT true
);


ALTER TABLE public.productos OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: productos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productos_id_seq OWNER TO postgres;

--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 219
-- Name: productos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productos_id_seq OWNED BY public.productos.id;


--
-- TOC entry 222 (class 1259 OID 24577)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre_completo character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    rol character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    activo boolean DEFAULT true
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24576)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4839 (class 2604 OID 24597)
-- Name: auditoria_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria_logs ALTER COLUMN id SET DEFAULT nextval('public.auditoria_logs_id_seq'::regclass);


--
-- TOC entry 4845 (class 2604 OID 32772)
-- Name: clientes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);


--
-- TOC entry 4844 (class 2604 OID 24625)
-- Name: pedido_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido_items ALTER COLUMN id SET DEFAULT nextval('public.pedido_items_id_seq'::regclass);


--
-- TOC entry 4841 (class 2604 OID 24614)
-- Name: pedidos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos ALTER COLUMN id SET DEFAULT nextval('public.pedidos_id_seq'::regclass);


--
-- TOC entry 4835 (class 2604 OID 16393)
-- Name: productos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos ALTER COLUMN id SET DEFAULT nextval('public.productos_id_seq'::regclass);


--
-- TOC entry 4837 (class 2604 OID 24580)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 5019 (class 0 OID 24594)
-- Dependencies: 224
-- Data for Name: auditoria_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.auditoria_logs VALUES (7, 1, 'CREACION DE USUARIO', 'Se creó el usuario: Franz@gmail.com con el rol: administrador', '2025-11-22 05:30:26.325963+00');
INSERT INTO public.auditoria_logs VALUES (8, 1, 'DESHABILITACION DE USUARIO', 'Se cambió el estado del usuario: Franz@gmail.com', '2025-11-22 05:30:36.26359+00');
INSERT INTO public.auditoria_logs VALUES (9, 1, 'HABILITACION DE USUARIO', 'Se cambió el estado del usuario: Franz@gmail.com', '2025-11-22 05:30:38.518141+00');


--
-- TOC entry 5025 (class 0 OID 32769)
-- Dependencies: 230
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.clientes VALUES (2, 'Juanz Peres dos', '1234568', 2);
INSERT INTO public.clientes VALUES (1, 'Juan Perez', '1234567', 4);


--
-- TOC entry 5023 (class 0 OID 24622)
-- Dependencies: 228
-- Data for Name: pedido_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.pedido_items VALUES (1, 1, 5, 1, 2.50);
INSERT INTO public.pedido_items VALUES (2, 1, 3, 1, 5.50);
INSERT INTO public.pedido_items VALUES (3, 1, 4, 1, 4.00);
INSERT INTO public.pedido_items VALUES (4, 2, 4, 2, 1.00);
INSERT INTO public.pedido_items VALUES (5, 2, 5, 1, 0.50);
INSERT INTO public.pedido_items VALUES (6, 3, 5, 1, 0.50);
INSERT INTO public.pedido_items VALUES (7, 4, 8, 1, 5.00);
INSERT INTO public.pedido_items VALUES (8, 5, 8, 2, 5.00);
INSERT INTO public.pedido_items VALUES (9, 6, 4, 1, 1.00);
INSERT INTO public.pedido_items VALUES (10, 7, 4, 2, 1.00);
INSERT INTO public.pedido_items VALUES (11, 7, 3, 3, 1.00);
INSERT INTO public.pedido_items VALUES (12, 8, 4, 4, 1.00);
INSERT INTO public.pedido_items VALUES (13, 9, 5, 2, 0.50);
INSERT INTO public.pedido_items VALUES (14, 9, 4, 1, 1.00);
INSERT INTO public.pedido_items VALUES (15, 10, 4, 2, 4.00);
INSERT INTO public.pedido_items VALUES (16, 11, 8, 1, 5.00);
INSERT INTO public.pedido_items VALUES (17, 11, 4, 1, 1.00);
INSERT INTO public.pedido_items VALUES (18, 12, 4, 3, 1.00);
INSERT INTO public.pedido_items VALUES (19, 13, 4, 1, 1.00);
INSERT INTO public.pedido_items VALUES (20, 13, 5, 1, 0.50);
INSERT INTO public.pedido_items VALUES (21, 13, 8, 4, 5.00);
INSERT INTO public.pedido_items VALUES (22, 14, 8, 1, 5.00);
INSERT INTO public.pedido_items VALUES (23, 15, 8, 2, 5.00);
INSERT INTO public.pedido_items VALUES (24, 16, 3, 1, 1.00);
INSERT INTO public.pedido_items VALUES (25, 16, 4, 1, 1.00);
INSERT INTO public.pedido_items VALUES (26, 17, 8, 1, 5.00);
INSERT INTO public.pedido_items VALUES (27, 18, 8, 1, 5.00);
INSERT INTO public.pedido_items VALUES (28, 18, 4, 1, 1.00);
INSERT INTO public.pedido_items VALUES (29, 19, 5, 1, 0.50);
INSERT INTO public.pedido_items VALUES (30, 20, 8, 2, 5.00);
INSERT INTO public.pedido_items VALUES (31, 20, 5, 1, 0.50);
INSERT INTO public.pedido_items VALUES (32, 21, 5, 2, 0.50);
INSERT INTO public.pedido_items VALUES (33, 21, 4, 2, 1.00);


--
-- TOC entry 5021 (class 0 OID 24611)
-- Dependencies: 226
-- Data for Name: pedidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.pedidos VALUES (1, '2025-11-21 18:33:23.108221+00', 12.00, 'Entregado', NULL, NULL);
INSERT INTO public.pedidos VALUES (2, '2025-11-21 18:46:47.773252+00', 2.50, 'Entregado', NULL, NULL);
INSERT INTO public.pedidos VALUES (3, '2025-11-21 18:50:28.273793+00', 0.50, 'Entregado', NULL, NULL);
INSERT INTO public.pedidos VALUES (4, '2025-11-21 18:53:28.760041+00', 5.00, 'Entregado', NULL, NULL);
INSERT INTO public.pedidos VALUES (5, '2025-11-21 18:54:13.816245+00', 10.00, 'Entregado', NULL, NULL);
INSERT INTO public.pedidos VALUES (6, '2025-11-21 19:08:48.320729+00', 1.00, 'Entregado', NULL, NULL);
INSERT INTO public.pedidos VALUES (7, '2025-11-21 19:11:52.604129+00', 5.00, 'Entregado', NULL, NULL);
INSERT INTO public.pedidos VALUES (8, '2025-11-22 01:00:06.638821+00', 4.00, 'Entregado', NULL, NULL);
INSERT INTO public.pedidos VALUES (9, '2025-11-22 01:58:59.446421+00', 2.00, 'Entregado', NULL, NULL);
INSERT INTO public.pedidos VALUES (10, '2025-11-22 04:46:19.262586+00', 8.00, 'Entregado', 1, NULL);
INSERT INTO public.pedidos VALUES (11, '2025-11-22 05:17:46.04009+00', 6.00, 'Entregado', 2, NULL);
INSERT INTO public.pedidos VALUES (12, '2025-11-22 14:37:21.417155+00', 3.00, 'Entregado', 2, NULL);
INSERT INTO public.pedidos VALUES (13, '2025-11-22 14:38:52.734715+00', 21.50, 'Entregado', NULL, NULL);
INSERT INTO public.pedidos VALUES (14, '2025-11-22 16:36:09.144005+00', 5.00, 'Entregado', NULL, NULL);
INSERT INTO public.pedidos VALUES (15, '2025-11-22 16:36:40.957359+00', 10.00, 'Entregado', NULL, NULL);
INSERT INTO public.pedidos VALUES (16, '2025-11-22 16:54:50.964034+00', 2.00, 'Recibido', 1, NULL);
INSERT INTO public.pedidos VALUES (17, '2025-11-22 16:55:41.803515+00', 5.00, 'Recibido', NULL, NULL);
INSERT INTO public.pedidos VALUES (18, '2025-11-22 17:42:39.848368+00', 6.00, 'Recibido', NULL, NULL);
INSERT INTO public.pedidos VALUES (19, '2025-11-22 17:43:09.187983+00', 0.50, 'Recibido', NULL, NULL);
INSERT INTO public.pedidos VALUES (20, '2025-11-22 17:46:46.711574+00', 10.50, 'Recibido', 1, NULL);
INSERT INTO public.pedidos VALUES (21, '2025-11-23 15:39:52.414026+00', 3.00, 'Recibido', 1, 'Efectivo');


--
-- TOC entry 5015 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.productos VALUES (4, 'cafe', 'taza', 1.00, 'Bebida', true);
INSERT INTO public.productos VALUES (3, 'Hoja de pan con leche de soja ', 'matematicas', 1.00, 'Postre', true);
INSERT INTO public.productos VALUES (5, 'Api con sopaipilla', 'ow0', 0.50, 'Postre', true);
INSERT INTO public.productos VALUES (8, 'Quesadilla SAD', 'una quesadilla triste', 5.00, 'Comida', true);


--
-- TOC entry 5017 (class 0 OID 24577)
-- Dependencies: 222
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuarios VALUES (1, 'Administrador Principal', 'admin@cafeteria.com', 'administrador', 'admin123', true);
INSERT INTO public.usuarios VALUES (4, ' ', 'asdsa@a', 'cajero', '$2b$10$ICRasTyjj5AiQfyjBW1RmONxW5EtJgyoBwIjWEXvokA5ClJON0D96', false);
INSERT INTO public.usuarios VALUES (2, 'Cajero de Prueba', 'cajero@test.com', 'cajero', '$2b$10$jGsjOTXA.aVG477f9Qo.q.yE5B4C4S0Rg9cYQO6fuFxpy.8ofS4L2', true);
INSERT INTO public.usuarios VALUES (3, 'Franz', 'Franz@gamil', 'cajero', '$2b$10$CJFHh65yN9i81uwqD3iY2e758Z.u0IupYp32vAB5blclPljPFTfO2', false);
INSERT INTO public.usuarios VALUES (5, ' Jhonatan ', 'j@gma', 'cajero', '$2b$10$VyqoOQ4FXJTByq6oiOOgIuyg1ZDC1RmCgz37cMt8DbDoGAMuv8Coe', false);
INSERT INTO public.usuarios VALUES (6, 'fanny', 'jariverag16@gmail.com', 'cajero', '$2b$10$hnQMPhAiLKXLoYz7xnhM.uN6e6k8xms5bkaYTHT9jj7g6yZOD.fPy', false);
INSERT INTO public.usuarios VALUES (7, 'Juan', 'Juan@Juanerobananero.com', 'cajero', '$2b$10$IqOmOYvmVrSypL6k6NzzOO.mXVvvwLUMiNyNt/8QrA94U.eBadyve', true);
INSERT INTO public.usuarios VALUES (8, 'Jhonatan Rivera', 'Franz@gmail.com', 'administrador', '$2b$10$GlhNzjVHGp62rqxCdysvzOL6khtklpitVdhd1UM6.THMUEsQlY.Ry', true);


--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 223
-- Name: auditoria_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auditoria_logs_id_seq', 9, true);


--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 229
-- Name: clientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clientes_id_seq', 2, true);


--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 227
-- Name: pedido_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedido_items_id_seq', 33, true);


--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 225
-- Name: pedidos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedidos_id_seq', 21, true);


--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 219
-- Name: productos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productos_id_seq', 8, true);


--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 8, true);


--
-- TOC entry 4854 (class 2606 OID 24604)
-- Name: auditoria_logs auditoria_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria_logs
    ADD CONSTRAINT auditoria_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4860 (class 2606 OID 32780)
-- Name: clientes clientes_ci_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_ci_key UNIQUE (ci);


--
-- TOC entry 4862 (class 2606 OID 32778)
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- TOC entry 4858 (class 2606 OID 24632)
-- Name: pedido_items pedido_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido_items
    ADD CONSTRAINT pedido_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4856 (class 2606 OID 24620)
-- Name: pedidos pedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_pkey PRIMARY KEY (id);


--
-- TOC entry 4848 (class 2606 OID 16402)
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id);


--
-- TOC entry 4850 (class 2606 OID 24592)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 4852 (class 2606 OID 24590)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4863 (class 2606 OID 24605)
-- Name: auditoria_logs auditoria_logs_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria_logs
    ADD CONSTRAINT auditoria_logs_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 4865 (class 2606 OID 24633)
-- Name: pedido_items pedido_items_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido_items
    ADD CONSTRAINT pedido_items_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id) ON DELETE CASCADE;


--
-- TOC entry 4866 (class 2606 OID 24638)
-- Name: pedido_items pedido_items_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido_items
    ADD CONSTRAINT pedido_items_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id);


--
-- TOC entry 4864 (class 2606 OID 32781)
-- Name: pedidos pedidos_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;


-- Completed on 2025-11-23 12:49:44

--
-- PostgreSQL database dump complete
--

\unrestrict aKjyrlB0VRnlgGdL0CBDK6nr9o7lRDZab6O6T2FBTJeVSHvmId3LbdsiO4nPHvV

