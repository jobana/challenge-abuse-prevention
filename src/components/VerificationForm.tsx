import React from 'react';
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from 'react-google-recaptcha';
import { 
  Input, 
  Button, 
  Select, 
  LoadingSpinner, 
  ErrorMessage 
} from './ui';
import { useVerificationForm } from '../hooks/useVerificationForm';
import styles from './VerificationForm.module.scss';

export const VerificationForm: React.FC = () => {
  const { t } = useTranslation();
  const {
    form,
    handleSubmit,
    resetForm,
    getFieldState,
    isSubmitting,
    isSuccess,
    error,
    countries,
    countriesLoading,
    countriesError,
    captchaRef,
    isCaptchaLoaded,
    isCaptchaVerified,
    captchaError,
    resetCaptcha,
    getCaptchaSiteKey,
    onCaptchaSuccess,
    onCaptchaExpired,
    onCaptchaError,
  } = useVerificationForm();

  const { register, formState: { errors, isValid, isDirty } } = form;

  // Si el formulario se envió exitosamente
  if (isSuccess) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className={styles.successTitle}>
          {t('form.success.title')}
        </h2>
        <p className={styles.successMessage}>
          {t('form.success.message')}
        </p>
        <Button
          variant="primary"
          onClick={resetForm}
          className={styles.resetButton}
        >
          {t('form.success.newVerification')}
        </Button>
      </div>
    );
  }

  return (
    <form 
      className={styles.verificationForm}
      onSubmit={handleSubmit}
      noValidate
      aria-label={t('form.ariaLabel')}
    >
      <div className={styles.formHeader}>
        <h1 className={styles.formTitle}>
          {t('form.title')}
        </h1>
        <p className={styles.formDescription}>
          {t('form.description')}
        </p>
      </div>

      {/* Error general del formulario */}
      {error && (
        <ErrorMessage
          message={error}
          variant="error"
          className={styles.formError}
        />
      )}

      <div className={styles.formFields}>
        {/* Campo Nombre */}
        <div className={styles.fieldGroup}>
          <Input
            {...register('name')}
            type="text"
            label={t('form.fields.name.label')}
            placeholder={t('form.fields.name.placeholder')}
            required
            autoComplete="given-name"
            aria-describedby="name-error"
            className={getFieldState('name').hasError ? styles.fieldError : ''}
          />
          {getFieldState('name').hasError && (
            <ErrorMessage
              id="name-error"
              message={getFieldState('name').errorMessage}
              variant="error"
              className={styles.fieldErrorMessage}
            />
          )}
        </div>

        {/* Campo País */}
        <div className={styles.fieldGroup}>
          <Select
            {...register('country')}
            label={t('form.fields.country.label')}
            placeholder={t('form.fields.country.placeholder')}
            required
            disabled={countriesLoading}
            aria-describedby="country-error"
            className={getFieldState('country').hasError ? styles.fieldError : ''}
          >
            {countriesLoading ? (
              <option value="" disabled>
                {t('form.fields.country.loading')}
              </option>
            ) : countriesError ? (
              <option value="" disabled>
                {t('form.fields.country.error')}
              </option>
            ) : (
              <>
                <option value="" disabled>
                  {t('form.fields.country.placeholder')}
                </option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </>
            )}
          </Select>
          {getFieldState('country').hasError && (
            <ErrorMessage
              id="country-error"
              message={getFieldState('country').errorMessage}
              variant="error"
              className={styles.fieldErrorMessage}
            />
          )}
        </div>

        {/* Campo Dirección */}
        <div className={styles.fieldGroup}>
          <Input
            {...register('address')}
            type="text"
            label={t('form.fields.address.label')}
            placeholder={t('form.fields.address.placeholder')}
            required
            autoComplete="street-address"
            aria-describedby="address-error"
            className={getFieldState('address').hasError ? styles.fieldError : ''}
          />
          {getFieldState('address').hasError && (
            <ErrorMessage
              id="address-error"
              message={getFieldState('address').errorMessage}
              variant="error"
              className={styles.fieldErrorMessage}
            />
          )}
        </div>
      </div>

      {/* CAPTCHA */}
      <div className={styles.captchaContainer}>
        {isCaptchaLoaded ? (
          <ReCAPTCHA
            ref={captchaRef}
            sitekey={getCaptchaSiteKey()}
            onChange={onCaptchaSuccess}
            onExpired={onCaptchaExpired}
            onErrored={onCaptchaError}
            theme="light"
            size="normal"
            hl={t('captcha.language')}
            aria-label={t('captcha.ariaLabel')}
          />
        ) : (
          <div className={styles.captchaLoading}>
            <LoadingSpinner size="sm" />
            <span>{t('captcha.loading')}</span>
          </div>
        )}
        
        {captchaError && (
          <ErrorMessage
            message={captchaError}
            variant="error"
            className={styles.captchaError}
          />
        )}
      </div>

      {/* Botones del formulario */}
      <div className={styles.formActions}>
        <Button
          type="button"
          variant="secondary"
          onClick={resetForm}
          disabled={isSubmitting}
          className={styles.resetButton}
        >
          {t('form.actions.reset')}
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || !isValid || !isCaptchaVerified}
          className={styles.submitButton}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" />
              {t('form.actions.submitting')}
            </>
          ) : (
            t('form.actions.submit')
          )}
        </Button>
      </div>

      {/* Información adicional */}
      <div className={styles.formFooter}>
        <p className={styles.formFooterText}>
          {t('form.footer.privacy')}
        </p>
        <p className={styles.formFooterText}>
          {t('form.footer.required')}
        </p>
      </div>
    </form>
  );
};
