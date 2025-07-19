import { useUser } from "../hooks/login-context";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    // Aguarda o login
    const success = await login(email, password);

    // Redireciona apenas se login for bem-sucedido
    if (success) {
      navigate("/");
    } else {
      alert("Login falhou. Verifique suas credenciais.");
    }
  };

  return (
    <div className='login-container'>
      <div className='logo'>
        <div className='logo-text'>
          <img
            src='./images/logo.png'
            alt='Logo'
          />
        </div>
      </div>

      <form
        id='loginForm'
        onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            name='email'
            placeholder='Digite seu email'
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='password'>Senha</label>
          <input
            type='password'
            id='password'
            name='password'
            placeholder='Digite sua senha'
            required
          />
        </div>

        <button
          type='submit'
          className='sign-in-btn'>
          Login
        </button>
      </form>

      <a
        href='#'
        className='forgot-password'>
        Perdeu a senha?
      </a>
    </div>
  );
}
