-- Fixed people + habits for this challenge. Safe to re-run (upserts by primary key).

insert into people (id, display_name, emoji, sort_order) values
  ('vinicius', 'Vinicius', '👤', 1),
  ('camila', 'Camila', '👤', 2)
on conflict (id) do update set
  display_name = excluded.display_name,
  emoji = excluded.emoji,
  sort_order = excluded.sort_order;

insert into habits (id, label, icon, person_id, sort_order, failed_glyph) values
  ('sem_doces', 'Sem doces', '🍬', 'vinicius', 1, '✕'),
  ('sem_refrigerante_vinicius', 'Sem refrigerante', '🥤', 'vinicius', 2, '✕'),
  ('treino_vinicius', 'Treino', '🏋️', 'vinicius', 3, '—'),
  ('sem_doces_camila', 'Sem doces', '🍬', 'camila', 1, '✕'),
  ('sem_refrigerante_camila', 'Sem refrigerante', '🥤', 'camila', 2, '✕'),
  ('treino_camila', 'Treino', '🏋️', 'camila', 3, '—')
on conflict (id) do update set
  label = excluded.label,
  icon = excluded.icon,
  person_id = excluded.person_id,
  sort_order = excluded.sort_order,
  failed_glyph = excluded.failed_glyph;

-- Set the challenge start date once, here or via a direct SQL update later
-- (see README.md for how to reuse this schema for a future challenge).
insert into settings (id, challenge_start_date, challenge_duration_days)
values (1, current_date, 30)
on conflict (id) do nothing;
