import React from 'react';

interface NoScriptFormProps {
  locale: string;
  initialData?: any;
}

export const NoScriptForm: React.FC<NoScriptFormProps> = ({ locale, initialData }) => {
  const isSpanish = locale.startsWith('es');
  
  return (
    <div className="noscript-form">
      <div className="noscript-form__container">
        <div className="noscript-form__header">
          <h1 className="noscript-form__title">
            {isSpanish ? 'Verificación de Datos' : 'Verificação de Dados'}
          </h1>
          <p className="noscript-form__description">
            {isSpanish 
              ? 'Por favor, completa la información solicitada para continuar con la verificación.'
              : 'Por favor, complete as informações solicitadas para continuar com a verificação.'
            }
          </p>
        </div>

        <form 
          className="noscript-form__form"
          action="/api/verification/submit"
          method="POST"
          noValidate
        >
          {/* Campo oculto para el token de referencia */}
          {initialData?.token && (
            <input type="hidden" name="token" value={initialData.token} />
          )}
          
          {/* Campo oculto para el referrer */}
          {initialData?.referrer && (
            <input type="hidden" name="referrer" value={initialData.referrer} />
          )}

          <div className="noscript-form__field">
            <label htmlFor="name" className="noscript-form__label">
              {isSpanish ? 'Nombre completo *' : 'Nome completo *'}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="noscript-form__input"
              placeholder={isSpanish ? 'Ingresa tu nombre completo' : 'Digite seu nome completo'}
              required
              minLength={2}
              maxLength={100}
              pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
              autoComplete="given-name"
            />
            <div className="noscript-form__error" id="name-error"></div>
          </div>

          <div className="noscript-form__field">
            <label htmlFor="country" className="noscript-form__label">
              {isSpanish ? 'País *' : 'País *'}
            </label>
            <select
              id="country"
              name="country"
              className="noscript-form__select"
              required
            >
              <option value="">
                {isSpanish ? 'Selecciona tu país' : 'Selecione seu país'}
              </option>
              <option value="AR">🇦🇷 Argentina</option>
              <option value="BR">🇧🇷 Brasil</option>
            </select>
            <div className="noscript-form__error" id="country-error"></div>
          </div>

          <div className="noscript-form__field">
            <label htmlFor="address" className="noscript-form__label">
              {isSpanish ? 'Dirección *' : 'Endereço *'}
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="noscript-form__input"
              placeholder={isSpanish ? 'Ingresa tu dirección completa' : 'Digite seu endereço completo'}
              required
              minLength={10}
              maxLength={200}
              autoComplete="street-address"
            />
            <div className="noscript-form__error" id="address-error"></div>
          </div>

          <div className="noscript-form__captcha">
            <div className="noscript-form__captcha-info">
              <p className="noscript-form__captcha-text">
                {isSpanish 
                  ? 'Para continuar, habilita JavaScript en tu navegador para completar la verificación de seguridad.'
                  : 'Para continuar, habilite JavaScript no seu navegador para completar a verificação de segurança.'
                }
              </p>
            </div>
          </div>

          <div className="noscript-form__actions">
            <button
              type="submit"
              className="noscript-form__submit"
              disabled
            >
              {isSpanish ? 'Verificar Datos' : 'Verificar Dados'}
            </button>
          </div>

          <div className="noscript-form__footer">
            <p className="noscript-form__footer-text">
              {isSpanish 
                ? 'Tus datos están protegidos y solo se utilizan para la verificación.'
                : 'Seus dados estão protegidos e são usados apenas para verificação.'
              }
            </p>
            <p className="noscript-form__footer-text">
              {isSpanish 
                ? 'Los campos marcados con * son obligatorios.'
                : 'Os campos marcados com * são obrigatórios.'
              }
            </p>
          </div>
        </form>

        <div className="noscript-form__help">
          <h3 className="noscript-form__help-title">
            {isSpanish ? '¿Cómo habilitar JavaScript?' : 'Como habilitar JavaScript?'}
          </h3>
          <div className="noscript-form__help-content">
            <h4>{isSpanish ? 'Chrome/Edge:' : 'Chrome/Edge:'}</h4>
            <ol>
              <li>{isSpanish ? 'Haz clic en el menú (⋮)' : 'Clique no menu (⋮)'}</li>
              <li>{isSpanish ? 'Ve a Configuración' : 'Vá para Configurações'}</li>
              <li>{isSpanish ? 'Busca "JavaScript"' : 'Procure por "JavaScript"'}</li>
              <li>{isSpanish ? 'Activa "Permitir"' : 'Ative "Permitir"'}</li>
            </ol>
            
            <h4>{isSpanish ? 'Firefox:' : 'Firefox:'}</h4>
            <ol>
              <li>{isSpanish ? 'Escribe "about:config" en la barra de direcciones' : 'Digite "about:config" na barra de endereços'}</li>
              <li>{isSpanish ? 'Busca "javascript.enabled"' : 'Procure por "javascript.enabled"'}</li>
              <li>{isSpanish ? 'Establece el valor en "true"' : 'Defina o valor como "true"'}</li>
            </ol>
            
            <h4>{isSpanish ? 'Safari:' : 'Safari:'}</h4>
            <ol>
              <li>{isSpanish ? 'Ve a Safari > Preferencias' : 'Vá para Safari > Preferências'}</li>
              <li>{isSpanish ? 'Haz clic en "Seguridad"' : 'Clique em "Segurança"'}</li>
              <li>{isSpanish ? 'Marca "Habilitar JavaScript"' : 'Marque "Habilitar JavaScript"'}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
