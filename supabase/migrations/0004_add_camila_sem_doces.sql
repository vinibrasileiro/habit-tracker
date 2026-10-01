-- Camila joined the "sem doces" habit too. Adds her row and fixes the sort
-- order of her other two habits so "Sem doces" leads, matching Vinicius's
-- order. Safe to re-run.

insert into habits (id, label, icon, person_id, sort_order, failed_glyph) values
  ('sem_doces_camila', 'Sem doces', '🍬', 'camila', 1, '✕')
on conflict (id) do update set
  label = excluded.label,
  icon = excluded.icon,
  person_id = excluded.person_id,
  sort_order = excluded.sort_order,
  failed_glyph = excluded.failed_glyph;

update habits set sort_order = 2 where id = 'sem_refrigerante_camila';
update habits set sort_order = 3 where id = 'treino_camila';
