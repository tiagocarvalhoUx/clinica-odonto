-- Script para ver dentistas cadastrados e atualizar orçamentos antigos

-- 1. Ver todos os dentistas cadastrados
SELECT id, name, cro, specialty, active FROM dentists ORDER BY id;

-- 2. Ver orçamentos sem dentista
SELECT id, patient_id, dentist_id, created_at FROM budgets WHERE dentist_id IS NULL;

-- 3. Atualizar TODOS os orçamentos sem dentista para um dentista específico
-- Substitua o número 1 pelo ID do dentista que você quer usar
-- UPDATE budgets SET dentist_id = 1 WHERE dentist_id IS NULL;

-- 4. Verificar atualização
-- SELECT b.id, b.dentist_id, d.name as dentist_name 
-- FROM budgets b 
-- LEFT JOIN dentists d ON b.dentist_id = d.id 
-- WHERE b.dentist_id IS NOT NULL;
