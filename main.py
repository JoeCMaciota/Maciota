import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os

driver = webdriver.Safari()
driver.maximize_window() 

try:
    # 1. Abre a página de login (coloque aqui o link EXATO se diferente!)
    driver.get("https://tjrj.pje.jus.br/1g/login.seam?loginComCertificado=false")
    time.sleep(3)

     # 2. Clica no botão "ENTRAR" (id: botaoRedirecionarSSO)
    entrar_btn = driver.find_element(By.ID, "botaoRedirecionarSSO")
    entrar_btn.click()
    time.sleep(3)  # Aguarda redirecionamento para tela de login SSO

    # 2. Preenche o LOGIN (CPF/CNPJ)
    login_input = driver.find_element(By.ID, "username")
    login_input.send_keys("73632139172")  # <-- PREENCHA AQUI COM SEU LOGIN (CPF/CNPJ)

    # 2. Preenche a SENHA
    senha_input = driver.find_element(By.ID, "password")
    senha_input.send_keys("Joe@2406")  # <-- PREENCHA AQUI COM SUA SENHA

    # 2. Envia o formulário de login
    senha_input.send_keys(Keys.RETURN)
    time.sleep(5)

    # 3. Clica no botão "Painel do usuário"
    painel_btn = driver.find_element(By.XPATH, "//input[@type='submit' and @value='Painel do usuário']")
    painel_btn.click()
    time.sleep(5)

     # 4. Clica na aba "Consulta processos"
    aba_consulta = driver.find_element(By.ID, "tabConsultaProcesso_lbl")
    aba_consulta.click()
    time.sleep(2)

    # Troca o foco do Selenium para o iframe correto
    iframe = driver.find_element(By.ID, "frameConsultaProcessos")
    driver.switch_to.frame(iframe)

    # 5. Espera e preenche o número do processo
    wait = WebDriverWait(driver, 20)
    processo_input = wait.until(
        EC.visibility_of_element_located((By.ID, "fPP:numeroProcesso:numeroSequencial"))
    )
    processo_input.click()
    processo_input.clear()
    processo_input.send_keys("08200905520238190205")  # <-- número do processo completo
    time.sleep(2)
    processo_input.send_keys(Keys.TAB)
    time.sleep(2)

    # ETAPA 9: Clica no botão "Pesquisar"
    pesquisar_btn = wait.until(
        EC.element_to_be_clickable((By.ID, "fPP:searchProcessos"))
    )
    pesquisar_btn.click()
    time.sleep(5)


    # Rola para o topo da página
    driver.switch_to.default_content()
    driver.execute_script("window.scrollTo(0, 0);")


    # Salva screenshot
    driver.save_screenshot('resultado.png')
    print("Screenshot salvo em:", os.path.abspath('resultado.png'))


    # ETAPA 10: Extrai as informações do processo (ajuste conforme sua necessidade)
    print(driver.find_element(By.TAG_NAME, "body").text)

finally:
    driver.quit()