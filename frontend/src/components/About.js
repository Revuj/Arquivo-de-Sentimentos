import React from 'react';
import { withTranslation } from 'react-i18next';
import Rafa from '../assets/rafa.jpg';
import Ze from '../assets/ze.jpg';
import Tiago from '../assets/tiago.jpg';

const About = ({ t }) => {
  const aboutSection = () => {
    return (
      <div className="main-card">
        <h4 className="card-title">{t('context')}</h4>
        <div className="card-content">
          <p>
            {t('context_part1')}
            <strong>{t('context_strong1')}</strong>
            {t('context_part2')}
          </p>
          <p>
            {t('context_part3')}
            <strong>{t('context_strong2')}</strong>
            {t('context_part4')}
            <strong>{t('context_strong3')}</strong>
            {t('context_part5')}
          </p>
        </div>
      </div>
    );
  };

  const goalsSection = () => {
    return (
      <div className="main-card">
        <h4 className="card-title">{t('goals')}</h4>
        <div className="card-content">
          <p>
            {t('goals_part1')}
            <strong>{t('goals_strong1')}</strong>
            {t('goals_part2')}
            <strong>{t('goals_strong2')}</strong>
            {t('goals_part3')}
            <strong>{t('goals_strong3')}</strong>
            {t('goals_part4')}
          </p>
        </div>
      </div>
    );
  };

  const howSection = () => {
    return (
      <div className="main-card">
        <h4 className="card-title">{t('howitsdone')}</h4>
        <div className="card-content">
          <p>{t('howitsdone_part1')}</p>
          <p>
            <strong>
              <a
                href="https://github.com/arquivo/pwa-technologies/wiki/Arquivo.pt-API"
                target="_blank"
                rel="noreferrer"
              >
                {t('howitsdone_strong1')}
              </a>
            </strong>
            {t('howitsdone_part2')}
          </p>
          <p>
            <strong>
              <a
                href="https://cloud.google.com/natural-language"
                target="_blank"
                rel="noreferrer"
              >
                {t('howitsdone_strong2')}
              </a>
            </strong>
            {t('howitsdone_part3')}
          </p>
        </div>
      </div>
    );
  };

  const teamSection = () => {
    return (
      <div className="main-card">
        <h4 className="card-title">{t('team')}</h4>
        <div className="card-content">
          <div id="team-members">
            <span className="picture-container">
              <img alt="João Varela" className="member-picture" src={Rafa} />
              <a
                href="https://www.joaovarela.me/"
                target="_blank"
                rel="noreferrer"
                className="member-name"
              >
                João Varela
              </a>
            </span>
            <span className="picture-container">
              <img alt="José Silva" className="member-picture" src={Ze} />
              <a
                href="https://github.com/krystalgamer"
                className="member-name"
                target="_blank"
                rel="noreferrer"
              >
                José Silva
              </a>
            </span>
            <span className="picture-container">
              <img alt="Tiago Verdade" className="member-picture" src={Tiago} />
              <a
                href="https://www.linkedin.com/in/tcverdade/"
                className="member-name"
                target="_blank"
                rel="noreferrer"
              >
                Tiago Verdade
              </a>
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="about-content">
      {aboutSection()}
      {goalsSection()}
      {howSection()}
      {teamSection()}
    </div>
  );
};

export default withTranslation()(About);
