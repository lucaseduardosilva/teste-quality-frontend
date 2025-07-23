import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:3001/clientes";

const inputStyle = {
  padding: "12px",
  marginBottom: "15px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "16px",
  width: "100%",
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  backgroundColor: "#5cb85c",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  overflow: "hidden",
};

const thStyle = {
  backgroundColor: "#f2f2f2",
  color: "#333",
  padding: "15px",
  textAlign: "left",
  fontWeight: "bold",
  fontSize: "18px",
};

const tdStyle = {
  padding: "15px",
  textAlign: "left",
  fontSize: "16px",
};

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalContentStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "8px",
  width: "90%",
  maxWidth: "600px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
};

const App = () => {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({});
  const [filtros, setFiltros] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async (params = filtros) => {
    setLoading(true);
    try {
      const res = await axios.get(API, { params });
      setClientes(res.data.items || []);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      alert("Erro ao buscar clientes.");
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    setForm((f) => ({ ...f, CEP: cep }));

    if (cep.length === 8) {
      try {
        const { data } = await axios.get(
          `https://viacep.com.br/ws/${cep}/json/`
        );
        if (!data.erro) {
          setForm((f) => ({
            ...f,
            Logradouro: data.logradouro,
            Bairro: data.bairro,
            Cidade: data.localidade,
            UF: data.uf,
          }));
        } else {
          alert("CEP não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        alert("Erro ao buscar CEP. Verifique o CEP digitado.");
      }
    }
  };

  const salvar = async () => {
    setSaving(true);
    try {
      if (form.id) {
        await axios.put(`${API}/${form.id}`, form);
      } else {
        await axios.post(API, form);
      }
      setForm({});
      fetchClientes();
      closeModal();
    } catch (error) {
      console.error("Erro ao salvar/atualizar cliente:", error);
      alert("Erro ao salvar/atualizar cliente.");
    } finally {
      setSaving(false);
    }
  };

  const editar = (cliente) => {
    setForm(cliente);
    openModal();
  };

  const excluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await axios.delete(`${API}/${id}`);
        fetchClientes();
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
        alert("Erro ao excluir cliente.");
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = () => {
    fetchClientes(filtros);
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setForm({});
  };

  return (
    <div
      style={{
        padding: "20px 40px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ color: "#333", marginBottom: 20, fontSize: "32px" }}>
        Cadastro de Clientes
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <input
          placeholder="Código"
          style={{ ...inputStyle, marginBottom: 0, width: "auto" }}
          name="Codigo"
          onChange={handleFilterChange}
        />
        <input
          placeholder="Nome"
          style={{ ...inputStyle, marginBottom: 0, width: "auto", flex: 1 }}
          name="Nome"
          onChange={handleFilterChange}
        />
        <input
          placeholder="Cidade"
          style={{ ...inputStyle, marginBottom: 0, width: "auto", flex: 1 }}
          name="Cidade"
          onChange={handleFilterChange}
        />
        <input
          placeholder="CEP"
          style={{ ...inputStyle, marginBottom: 0, width: "auto" }}
          name="CEP"
          onChange={handleFilterChange}
        />
        <button
          onClick={handleFilterSubmit}
          style={buttonStyle}
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
        <button
          onClick={openModal}
          style={{
            ...buttonStyle,
            marginLeft: "auto",
            backgroundColor: "#0275d8",
          }}
        >
          Adicionar Novo
        </button>
      </div>

      {loading ? (
        <p style={{ fontSize: "18px", textAlign: "center", margin: "50px" }}>
          Carregando clientes...
        </p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              <th style={thStyle}>Código</th>
              <th style={thStyle}>Nome</th>
              <th style={thStyle}>Cidade</th>
              <th style={thStyle}>CEP</th>
              <th style={thStyle}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes && clientes.length > 0 ? (
              clientes.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={tdStyle}>{c.Codigo}</td>
                  <td style={tdStyle}>{c.Nome}</td>
                  <td style={tdStyle}>{c.Cidade}</td>
                  <td style={tdStyle}>{c.CEP}</td>
                  <td style={{ ...tdStyle, display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => editar(c)}
                      style={{ ...buttonStyle, backgroundColor: "#f0ad4e" }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => excluir(c.id)}
                      style={{ ...buttonStyle, backgroundColor: "#d9534f" }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{ ...tdStyle, textAlign: "center", padding: "40px" }}
                >
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ color: "#333", marginBottom: 25, fontSize: "24px" }}>
              {form.id ? "Editar Cliente" : "Adicionar Cliente"}
            </h3>

            <input
              placeholder="Código"
              style={inputStyle}
              value={form.Codigo || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, Codigo: e.target.value }))
              }
            />
            <input
              placeholder="Nome"
              style={inputStyle}
              value={form.Nome || ""}
              onChange={(e) => setForm((f) => ({ ...f, Nome: e.target.value }))}
            />
            <input
              placeholder="CPF/CNPJ"
              style={inputStyle}
              value={form.CPF_CNPJ || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, CPF_CNPJ: e.target.value }))
              }
            />
            <input
              placeholder="CEP"
              style={inputStyle}
              value={form.CEP || ""}
              onChange={handleCepChange}
              maxLength={9}
            />
            <input
              placeholder="Logradouro"
              style={inputStyle}
              value={form.Logradouro || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, Logradouro: e.target.value }))
              }
            />
            <input
              placeholder="Número"
              style={inputStyle}
              value={form.Numero || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, Numero: e.target.value }))
              }
            />
            <input
              placeholder="Complemento"
              style={inputStyle}
              value={form.Complemento || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, Complemento: e.target.value }))
              }
            />
            <input
              placeholder="Cidade"
              style={inputStyle}
              value={form.Cidade || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, Cidade: e.target.value }))
              }
            />
            <input
              placeholder="UF"
              style={inputStyle}
              value={form.UF || ""}
              onChange={(e) => setForm((f) => ({ ...f, UF: e.target.value }))}
            />
            <input
              placeholder="Fone"
              style={inputStyle}
              value={form.Fone || ""}
              onChange={(e) => setForm((f) => ({ ...f, Fone: e.target.value }))}
            />
            <input
              placeholder="Limite Crédito"
              type="number"
              style={inputStyle}
              value={form.LimiteCredito || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, LimiteCredito: e.target.value }))
              }
            />

            <div>
              <label
                htmlFor="validade"
                style={{
                  fontSize: "14px",
                  color: "#555",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Validade
              </label>
              <input
                id="validade"
                type="date"
                style={inputStyle}
                value={form.Validade || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, Validade: e.target.value }))
                }
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                onClick={closeModal}
                style={{ ...buttonStyle, backgroundColor: "#6c757d" }}
              >
                Cancelar
              </button>
              <button onClick={salvar} style={buttonStyle} disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
