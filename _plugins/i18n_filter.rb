module Jekyll
  module I18nFilter
    def t(key, lang = nil)
      lang ||= @context.registers[:page]['lang'] || @context.registers[:site].config['lang'] || 'en'
      
      translations = @context.registers[:site].data['portfolio']
      keys = key.split('.')
      
      result = translations[lang]
      keys.each do |k|
        result = result[k] if result
      end
      
      result || key
    end
    
    def jsonify(input)
      case input
      when String
        '"' + input.gsub('\\', '\\\\').gsub('"', '\\"').gsub("\n", '\\n').gsub("\r", '\\r') + '"'
      when Array
        '[' + input.map { |item| jsonify(item) }.join(',') + ']'
      when Hash
        '{' + input.map { |k, v| "#{jsonify(k.to_s)}:#{jsonify(v)}" }.join(',') + '}'
      when nil
        'null'
      else
        input.to_s
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::I18nFilter)

