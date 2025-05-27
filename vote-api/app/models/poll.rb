class Poll < ApplicationRecord
  has_many :votes, dependent: :destroy

  def options
    JSON.parse(self[:options] || '[]')
  end

  def options=(value)
    self[:options] = value.to_json
  end
end
