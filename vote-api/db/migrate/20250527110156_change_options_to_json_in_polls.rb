class ChangeOptionsToJsonInPolls < ActiveRecord::Migration[7.0]
  def up
    # Залежно від СУБД - для PostgreSQL краще jsonb
    change_column :polls, :options, :jsonb, using: 'options::jsonb'
  end

  def down
    change_column :polls, :options, :text
  end
end
